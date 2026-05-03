import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from '@/contexts/AuthContext'
import { LogOut } from 'lucide-react'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

interface Message {
  id: string;
  text: string;
  uid: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) return;

    // 현재 사용자의 메시지만 시간순으로 가져오기
    const q = query(
      collection(db, 'messages'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });
    console.log("메시지: ", messages)

    return () => unsubscribe();
  }, [user]);

  const handleSubmit = async () => {
    if (inputText.trim() && user) {
      try {
        await addDoc(collection(db, 'messages'), {
          text: inputText.trim(),
          uid: user.uid,
          createdAt: serverTimestamp()
        });
        setInputText('')
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      {user && (
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {user.isAnonymous ? '익명 사용자' : user.email}
          </span>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      )}
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-slate-800">
            Message Test
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message..."
              className="focus-visible:ring-blue-500"
            />
            <Button onClick={handleSubmit} className="h-9 px-4 py-2">
              Send
            </Button>
          </div>

          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex justify-end animate-in fade-in slide-in-from-right-2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] wrap-break-words relative">
                    {message.text}
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-10">No messages yet.</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
