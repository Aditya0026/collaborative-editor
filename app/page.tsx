"use client"

import { useState, useCallback } from "react"
import type { Editor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { MessageSquare, Send, Sparkles, Edit3, MoreHorizontal, Bot, User, Check, X, Search, Globe } from "lucide-react"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  toolResults?: any[]
}

interface PreviewData {
  original: string
  suggestion: string
  selectionFrom: number
  selectionTo: number
}

interface FloatingToolbarProps {
  editor: Editor | null
  position: { x: number; y: number } | null
  onEdit: (text: string, action: string) => void
}

function FloatingToolbar({ editor, position, onEdit }: FloatingToolbarProps) {
  if (!position || !editor) return null

  const selectedText = editor.state.selection.empty
    ? ""
    : editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)

  const handleAction = (action: string) => {
    if (selectedText) {
      onEdit(selectedText, action)
    }
  }

  return (
    <Card
      className="absolute z-50 p-2 shadow-lg border bg-card"
      style={{
        left: position.x,
        top: position.y - 60,
      }}
    >
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={() => handleAction("edit")} className="h-8 px-2 text-xs">
          <Edit3 className="w-3 h-3 mr-1" />
          Edit with AI
        </Button>
        <Button size="sm" variant="ghost" onClick={() => handleAction("improve")} className="h-8 px-2 text-xs">
          <Sparkles className="w-3 h-3 mr-1" />
          Improve
        </Button>
        <Select onValueChange={handleAction}>
          <SelectTrigger className="h-8 w-8 p-0 border-0 bg-transparent hover:bg-accent">
            <MoreHorizontal className="w-3 h-3" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shorten">Shorten</SelectItem>
            <SelectItem value="expand">Expand</SelectItem>
            <SelectItem value="professional">Make Professional</SelectItem>
            <SelectItem value="casual">Make Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  )
}

function PreviewModal({ isOpen, onClose, previewData, onConfirm, isLoading }: any) {
  if (!previewData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Suggestion Preview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Original</Badge>
            </div>
            <div className="p-3 bg-muted rounded-lg text-sm">{previewData.original}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-primary">
                AI Suggestion
              </Badge>
            </div>
            <div className="p-3 bg-accent rounded-lg text-sm">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="ml-2">Generating suggestion...</span>
                </div>
              ) : (
                previewData.suggestion
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !previewData.suggestion}
            className="bg-primary hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-2" />
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function CollaborativeEditor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant with advanced capabilities. I can help you edit text, search the web for current information, and insert content directly into your editor. Try asking me to 'search for the latest Next.js 15 features and insert a summary' or select text and use the floating toolbar!",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedText, setSelectedText] = useState("")
  const [previewData, setPreviewData] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your document here...",
      }),
    ],
    immediatelyRender: false,
    content: `
      <h1>Welcome to the AI-Powered Collaborative Editor</h1>
      <p>This is a modern text editor with advanced AI integration. Here are some features to try:</p>
      <ul>
        <li>Select any text to see the floating toolbar with AI editing options</li>
        <li>Use the chat sidebar to interact with the AI assistant</li>
        <li>Ask the AI to search the web and insert information directly into your document</li>
        <li>Request specific text improvements like "make this more professional" or "shorten this paragraph"</li>
      </ul>
      <p>Try asking: "Search for the latest developments in AI and insert a summary here" or select this paragraph and use the floating toolbar!</p>

      <h2>Example Commands:</h2>
      <ul>
        <li>"Find the latest news about Next.js 15 and insert it below"</li>
        <li>"Search for React best practices and add them to this document"</li>
        <li>"What are the current trends in web development?"</li>
      </ul>
    `,
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection

      if (from === to) {
        setToolbarPosition(null)
        return
      }

      const selectedText = editor.state.doc.textBetween(from, to)
      setSelectedText(selectedText)

      const coords = editor.view.coordsAtPos(from)
      setToolbarPosition({
        x: coords.left,
        y: coords.top,
      })
    },
  })

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          selectedText: selectedText || null,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Handle tool results for editor insertion
      if (data.toolResults) {
        for (const toolResult of data.toolResults) {
          if (toolResult.toolName === "insertToEditor" && editor) {
            const result = toolResult.result
            if (result.type === "append") {
              editor
                .chain()
                .focus()
                .setTextSelection(editor.state.doc.content.size)
                .insertContent(`\n\n${result.content}`)
                .run()
            } else if (result.type === "replace" && selectedText) {
              const { from, to } = editor.state.selection
              editor.chain().focus().setTextSelection({ from, to }).insertContent(result.content).run()
            }
          }
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
        toolResults: data.toolResults,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, messages, selectedText, editor])

  const handleEditWithAI = useCallback(
    async (text: string, action: string) => {
      if (!editor) return

      const { from, to } = editor.state.selection

      setPreviewData({
        original: text,
        suggestion: "",
        selectionFrom: from,
        selectionTo: to,
      })
      setIsPreviewOpen(true)
      setIsGeneratingSuggestion(true)
      setToolbarPosition(null)

      try {
        const response = await fetch("/api/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, action }),
        })

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setPreviewData((prev) =>
          prev
            ? {
                ...prev,
                suggestion: data.suggestion,
              }
            : null,
        )
      } catch (error) {
        console.error("Edit error:", error)
        setPreviewData((prev) =>
          prev
            ? {
                ...prev,
                suggestion: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
              }
            : null,
        )
      } finally {
        setIsGeneratingSuggestion(false)
      }
    },
    [editor],
  )

  const handleConfirmSuggestion = useCallback(() => {
    if (!editor || !previewData) return

    editor
      .chain()
      .focus()
      .setTextSelection({ from: previewData.selectionFrom, to: previewData.selectionTo })
      .insertContent(previewData.suggestion)
      .run()

    const changeMessage: Message = {
      id: Date.now().toString(),
      content: `Applied AI suggestion: "${previewData.suggestion.substring(0, 100)}${previewData.suggestion.length > 100 ? "..." : ""}"`,
      role: "assistant",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, changeMessage])

    setIsPreviewOpen(false)
    setPreviewData(null)
  }, [editor, previewData])

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false)
    setPreviewData(null)
    setIsGeneratingSuggestion(false)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-card-foreground">AI-Powered Collaborative Editor</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="w-3 h-3" />
              <span>Web Search Enabled</span>
              <Search className="w-3 h-3" />
              <span>AI Agent Active</span>
            </div>
          </div>
        </header>

        <div className="flex-1 relative">
          <div className="h-full p-6">
            <EditorContent editor={editor} className="prose prose-sm max-w-none h-full focus:outline-none" />
          </div>

          <FloatingToolbar editor={editor} position={toolbarPosition} onEdit={handleEditWithAI} />
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 border-l bg-sidebar flex flex-col">
        <div className="p-4 border-b bg-sidebar">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sidebar-primary" />
            <h2 className="font-semibold text-sidebar-foreground">AI Agent Assistant</h2>
          </div>
          <p className="text-xs text-sidebar-foreground/70 mt-1">Can search web & edit documents</p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-sidebar-primary-foreground" />
                  </div>
                )}

                <div className="flex flex-col gap-2 max-w-[240px]">
                  <div
                    className={`rounded-lg p-3 text-sm ${
                      message.role === "user"
                        ? "bg-sidebar-primary text-sidebar-primary-foreground ml-auto"
                        : "bg-sidebar-accent text-sidebar-accent-foreground"
                    }`}
                  >
                    {message.content}
                  </div>

                  {message.toolResults && message.toolResults.length > 0 && (
                    <div className="space-y-2">
                      {message.toolResults.map((result, index) => (
                        <div key={index} className="text-xs bg-muted p-2 rounded border-l-2 border-primary">
                          <div className="font-medium flex items-center gap-1">
                            {result.toolName === "searchWeb" && <Search className="w-3 h-3" />}
                            {result.toolName === "insertToEditor" && <Edit3 className="w-3 h-3" />}
                            {result.toolName}
                          </div>
                          {result.toolName === "searchWeb" && result.result.summary && (
                            <div className="mt-1 text-muted-foreground">{result.result.summary}</div>
                          )}
                          {result.toolName === "insertToEditor" && (
                            <div className="mt-1 text-muted-foreground">{result.result.message}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-sidebar-primary-foreground" />
                </div>
                <div className="bg-sidebar-accent text-sidebar-accent-foreground rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-sidebar">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask AI to search web, edit text..."
              className="flex-1 bg-sidebar-accent text-sidebar-accent-foreground placeholder:text-sidebar-accent-foreground/60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        previewData={previewData}
        onConfirm={handleConfirmSuggestion}
        isLoading={isGeneratingSuggestion}
      />
    </div>
  )
}
