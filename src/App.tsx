import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

function App() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleSubmit = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, inputText.trim()])
      setInputText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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

          <ScrollArea className="h-87.5 pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex justify-end animate-in fade-in slide-in-from-right-2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] wrap-break-words relative">
                    {message}
                    <div className="absolute -top-px -right-1.25 w-3 h-3 bg-blue-600 [clip-path:polygon(0_0,100%_0,0_100%)]"></div>
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

export default App