import { useState } from 'react'

function App() {
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleSubmit = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, inputText.trim()])
      setInputText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Message Test
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Send
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="flex justify-end">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs relative">
                {message}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-blue-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
