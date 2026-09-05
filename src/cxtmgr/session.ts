import Modes from "@/config/modes.json"
import { clearChatMessagesInBackend } from "@/api/chat";


export const avatars_list : Record<string, string> = {
  'user'      : '😈',
  'assistant' : '🤖',
}

export const ChatRole = {
  user      : 'user',
  assistant : 'assistant',
  tool      : 'tool'
} as const;

export type ChatRole = typeof ChatRole[keyof typeof ChatRole];

export interface QueryMode {
  modeName      : string;
  displayName   : string;
  description?  : string;
  id?           : string;
}


export interface DisplayMessage {
  role          : string;
  content       : string;
  modeName?     : string | null;
  time?         : string;
  fileLinks?    : Array<{ text: string; fileId: string; fileName: string }>;
}

export interface MsgHistoryObject {
  messages : {role: string, content : string}[],
  note     : string
};


export interface HistoryDesc {
  id       : string,
  messages : { role : string, content : string }[],
  note     : string
}


export const loadChatHistory = async (
  historyId : string | undefined = undefined
) => {
  let history : HistoryDesc[] = [];
  try {
    history = _loadChatHistoryFromCache(historyId);

    if (history.length < 1) {
      history = await _loadMessageHistoryFromBackup();
    }
  } 
  catch (error) {
    history = [];
  }
  return history;
};


export const deleteChatHistory = async (
  historyId : string
) => {
  _deleteChatHistoryFromCache(historyId);
  try {
    clearChatMessagesInBackend(historyId)
  } catch (error) {
    
  }
}

export const updateChatHistoryNote = (historyId: string, content : string) => {
  _updateChatHistoryNote(historyId, content)
}

const _loadModesFromConfig = async (
  config : any[]
) : Promise<QueryMode[]> => {

  return config.map(mode => {
    return mode
  })
}


export const loadQueryModes = async () : Promise<QueryMode[]> => {
  return _loadModesFromConfig(Modes)
};


const _loadChatHistoryFromCache = (
  historyId : string | undefined = undefined
): HistoryDesc[] => {
  const histories: HistoryDesc[] = [];

  if (historyId) {
    const record = localStorage.getItem(historyId);
    if (record !== null) {
      const messageHistory = JSON.parse(record);
      histories.push({
          id       : historyId, 
          messages : messageHistory.messages,
          note     : messageHistory.note
        });
    }
  }
  else {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key && key.startsWith("cmh-")) {
        const record = localStorage.getItem(key);
        if (record) {
          const messageHistory = JSON.parse(record);
          try {
            histories.push({
                id : key, 
                messages : messageHistory.messages,
                note     : messageHistory.note
              });
          } catch (e) {
            console.warn(`Invalid history cache: ${key}`, e);
          }
        }
      }
    }
  }
  return histories;
};

const _updateChatHistoryNote = (historyId : string, content : string) => {
  const history = localStorage.getItem(historyId);
  if (history) {
    const historyObj = JSON.parse(history)
    const new_history : MsgHistoryObject = {
      messages : historyObj.messages,
      note     : content
    }

    localStorage.setItem(historyId, JSON.stringify(new_history))
  }
}

const _deleteChatHistoryFromCache = (
  historyId : string
) => {
  localStorage.removeItem(historyId);
}


const _loadMessageHistoryFromBackup = async () : Promise<HistoryDesc[]> => {
  let messageHistory : HistoryDesc[] = [];

  return messageHistory;
};


export class Session {
  private currMsgHistoryObj : MsgHistoryObject;
  public  msgHistoryId      : string;
  
  constructor(msgHistoryId :string) {
    this.msgHistoryId   = msgHistoryId;
    this.currMsgHistoryObj = {
      messages: [],
      note: ""
    };
    this._load(this.msgHistoryId);
  }

  private _load(msgHistoryId : string) 
  : void {
    const cached = localStorage.getItem(msgHistoryId);
    if (cached) {
      try {
        this.currMsgHistoryObj = JSON.parse(cached);
      } catch (err) {
        console.error('Failed to parse cached history', err);
        localStorage.removeItem(msgHistoryId);
      }
      return;
    }
    else {
      // @TODO: fetch data from backend

    }

    this.currMsgHistoryObj = {
      messages : [],
      note     : ""
    };
  }

  public getFullMsgHistory() : { role: string, content : string }[] {
    return this.currMsgHistoryObj.messages;
  }

  public getLatestMsg() : { role: string, content : string }[] {
    const lastMessage =
      this.currMsgHistoryObj.messages[
        this.currMsgHistoryObj.messages.length - 1
      ];
    return [lastMessage];
  }

  public pushMessageToHistory (
    role             : string,
    content          : string
  ) {  
    this.currMsgHistoryObj.messages.push(
      {
        role    : role,
        content : content
      }
    )
  };

  public async storeMessageHistory() {
    // localStorage.setItem(this.msgHistoryId, JSON.stringify(this.messageHistoryOld));
    localStorage.setItem(this.msgHistoryId, JSON.stringify(this.currMsgHistoryObj));
  }

  public async deleteMessageHistory(id : string) {
    localStorage.removeItem(id)
  }

  public async generateMessageFromResponse(
      messages : DisplayMessage[],
      msgIdx   : number | null,
      resp     : Response
  ) {
    try {
      // Handle streaming response
      const reader  = resp.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let slicedMessage = "";
      
      msgIdx = messages.length - 1;

      let buffer = "";

      while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          while (true) {
              const idx = buffer.indexOf("\n");
              if (idx === -1) break;

              const line = buffer.slice(0, idx).trim();
              buffer     = buffer.slice(idx + 1);

              if (!line) continue;

              const obj = JSON.parse(line);

              slicedMessage += obj.choices[0].message.content;
              messages[msgIdx].content = slicedMessage;
          }
      }
    } 
    catch (err) {
      console.error(err);
    }
  };
}