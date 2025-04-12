
import React, { useState } from 'react';
import { Search, Send, Smile, Mic, Image, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IceBreakers from '@/components/IceBreakers';

interface Contact {
  id: string;
  name: string;
  photo: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const contacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=60&q=60',
    lastMessage: 'That sounds like a great idea!',
    time: '2m ago',
    unread: true,
    online: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=60&q=60',
    lastMessage: 'Looking forward to our date next week!',
    time: '1h ago',
    unread: true,
    online: false,
  },
  {
    id: '3',
    name: 'Emma Williams',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&q=60',
    lastMessage: 'Have you tried that new restaurant?',
    time: '3h ago',
    unread: false,
    online: true,
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&q=60',
    lastMessage: 'Just finished that book you recommended!',
    time: 'Yesterday',
    unread: false,
    online: false,
  },
  {
    id: '5',
    name: 'Olivia Taylor',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=60&q=60',
    lastMessage: 'We should definitely go hiking this weekend!',
    time: 'Yesterday',
    unread: false,
    online: true,
  },
];

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: 'm1',
        senderId: '1',
        text: 'Hey there! I saw we have a 85% compatibility score. That\'s impressive!',
        time: '10:30 AM',
      },
      {
        id: 'm2',
        senderId: 'me',
        text: 'Hi Sarah! Yes, that\'s pretty cool. I noticed we both love hiking and coffee!',
        time: '10:32 AM',
        status: 'read',
      },
      {
        id: 'm3',
        senderId: '1',
        text: 'Absolutely! I\'m actually planning a hike this weekend at Bear Mountain. Ever been there?',
        time: '10:33 AM',
      },
      {
        id: 'm4',
        senderId: 'me',
        text: 'I love Bear Mountain! The views from the top are amazing. Would you be interested in company?',
        time: '10:40 AM',
        status: 'read',
      },
      {
        id: 'm5',
        senderId: '1',
        text: 'That sounds like a great idea! I\'d love to go hiking together. What time were you thinking?',
        time: '10:45 AM',
      },
    ],
    '2': [
      {
        id: 'm6',
        senderId: '2',
        text: 'Hi there! I noticed you\'re also into jazz music. Have you been to any good shows lately?',
        time: 'Yesterday',
      },
      {
        id: 'm7',
        senderId: 'me',
        text: 'Hey Michael! Yes, I went to the Blue Note last weekend. It was amazing! Do you play any instruments?',
        time: 'Yesterday',
        status: 'delivered',
      },
      {
        id: 'm8',
        senderId: '2',
        text: 'That\'s awesome! I play the piano but not professionally. Would love to check out Blue Note together sometime!',
        time: 'Yesterday',
      },
      {
        id: 'm9',
        senderId: 'me',
        text: 'That would be great! They have a really good show coming up next week. Would you be free on Friday?',
        time: 'Yesterday',
        status: 'delivered',
      },
      {
        id: 'm10',
        senderId: '2',
        text: 'Looking forward to our date next week!',
        time: '9:30 AM',
      },
    ],
  });
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    
    const contactMessages = messages[selectedContact.id] || [];
    setMessages({
      ...messages,
      [selectedContact.id]: [...contactMessages, newMessage],
    });
    
    setMessageText('');
  };
  
  const handleIcebreakerSelect = (icebreaker: {id: string, text: string}) => {
    if (!selectedContact) return;
    
    setMessageText(icebreaker.text);
  };
  
  const getContactMessages = (contactId: string) => {
    return messages[contactId] || [];
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-0 sm:px-6 lg:px-8 py-4 flex h-[calc(100vh-180px)]">
          <div className="bg-white border border-border rounded-l-xl w-full md:w-80 flex-shrink-0">
            <div className="p-4 border-b border-border flex items-center">
              <h2 className="font-medium text-lg">Messages</h2>
              <div className="ml-auto flex gap-1">
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100%-60px)]">
              <div className="p-2">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={`p-2 rounded-lg cursor-pointer transition-colors flex items-center ${
                      selectedContact?.id === contact.id ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={contact.photo} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{contact.name}</h3>
                        <span className="text-xs text-muted-foreground">{contact.time}</span>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                        {contact.unread && (
                          <span className="ml-2 bg-matchee-primary rounded-full h-2 w-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <div className="hidden md:flex flex-col flex-grow bg-white border-y border-r border-border rounded-r-xl overflow-hidden">
            {selectedContact ? (
              <>
                <div className="p-3 border-b border-border flex items-center bg-accent/30">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedContact.photo} alt={selectedContact.name} />
                      <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h3 className="font-medium">{selectedContact.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {selectedContact.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-auto flex gap-1">
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {getContactMessages(selectedContact.id).map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.senderId !== 'me' && (
                          <Avatar className="h-8 w-8 mr-2 flex-shrink-0 self-end">
                            <AvatarImage src={selectedContact.photo} />
                            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className="space-y-1 max-w-[80%]">
                          <div 
                            className={`p-3 rounded-xl ${
                              message.senderId === 'me' 
                                ? 'bg-matchee-primary text-white rounded-br-none' 
                                : 'bg-accent rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          
                          <div className={`flex text-xs text-muted-foreground ${
                            message.senderId === 'me' ? 'justify-end' : ''
                          }`}>
                            <span>{message.time}</span>
                            {message.status && (
                              <span className="ml-2">
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-border flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>
                  
                  <Input 
                    className="rounded-full bg-accent/50 border-0"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                    <Mic className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    className="rounded-full h-10 w-10 bg-matchee-primary hover:bg-matchee-primary/90 text-white"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-medium mb-4">Start the conversation</h2>
              <p className="text-muted-foreground mb-4">
                Having trouble finding the right words? Break the ice with one of these conversation starters.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IceBreakers onSelectIcebreaker={handleIcebreakerSelect} />
                <IceBreakers onSelectIcebreaker={handleIcebreakerSelect} />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-4">Conversation Tips</h2>
              <div className="bg-white border border-border rounded-xl p-4 space-y-3">
                <div>
                  <h3 className="font-medium">Ask Open-Ended Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Instead of asking yes/no questions, try questions that encourage detailed responses.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Share Your Experiences</h3>
                  <p className="text-sm text-muted-foreground">
                    Don't just ask questions—share your own experiences to create a balanced conversation.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Keep It Light Initially</h3>
                  <p className="text-sm text-muted-foreground">
                    Save deep personal questions for when you know each other better.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Be Authentic</h3>
                  <p className="text-sm text-muted-foreground">
                    Be yourself! Authentic conversations lead to meaningful connections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messages;
