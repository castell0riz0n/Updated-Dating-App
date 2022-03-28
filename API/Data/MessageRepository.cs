using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository: IMessageRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public MessageRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public void AddMessage(Message message)
    {
        this._context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);
    }

    public async Task<Message> GetMessage(int id)
    {
       return await _context.Messages
           .Include(a => a.Sender)
           .Include(a => a.Recipient)
           .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<PagedList<MessageDto>> GetMessageForUser(MessageParams messageParams)
    {
        var query = _context.Messages.OrderByDescending(a => a.MessageSent)
            .AsQueryable();

        query = messageParams.Container switch
        {
            "Inbox" => query.Where(a => a.Recipient.UserName == messageParams.Username && a.RecipientDeleted == false),
            "Outbox" => query.Where(a => a.Sender.UserName == messageParams.Username && a.SenderDeleted == false),
            _ => query.Where(a => a.Recipient.UserName == messageParams.Username && a.DateRead == null && a.RecipientDeleted == false)
        };

        var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
        return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
    {
        var messages = await _context.Messages
            .Include(a => a.Sender).ThenInclude(a => a.Photos)
            .Include(a => a.Recipient).ThenInclude(a => a.Photos)
            .Where(a => a.Recipient.UserName == currentUsername &&
                        a.RecipientDeleted == false &&
                        a.Sender.UserName == recipientUsername ||
                        a.Recipient.UserName == recipientUsername &&
                        a.Sender.UserName == currentUsername && a.SenderDeleted == false)
            .OrderBy(a => a.MessageSent)
            .ToListAsync();

        var unreadMessaged =
            messages.Where(a => a.DateRead == null && a.Recipient.UserName == currentUsername).ToList();
        if (unreadMessaged.Any())
        {
            foreach (var message in unreadMessaged)
            {
                message.DateRead = DateTime.Now;
            }

            await _context.SaveChangesAsync();
        }

        return _mapper.Map<IEnumerable<MessageDto>>(messages);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}