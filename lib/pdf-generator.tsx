import { jsPDF } from "jspdf"
import type { Editor } from "@tiptap/react"

interface Mark {
    type: string
    attrs?: Record<string, any>
}

interface TipTapNode {
    type: string
    content?: TipTapNode[]
    text?: string
    marks?: Mark[]
    attrs?: Record<string, any>
}

interface PDFConfig {
    leftMargin: number
    rightMargin: number
    topMargin: number
    pageHeight: number
    lineHeight: number
    fontSize: {
        normal: number
        h1: number
        h2: number
        h3: number
        h4: number
        h5: number
        h6: number
        code: number
    }
}

const DEFAULT_CONFIG: PDFConfig = {
    leftMargin: 20,
    rightMargin: 190,
    topMargin: 20,
    pageHeight: 280,
    lineHeight: 7,
    fontSize: {
        normal: 12,
        h1: 24,
        h2: 20,
        h3: 18,
        h4: 16,
        h5: 14,
        h6: 13,
        code: 10,
    },
}

function cleanTextForPDF(text: string): string {
    if (!text) return ""

    // Remove emojis and special unicode characters
    return text
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, "") // Emoticons
        .replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
        .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport & Map
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Flags
        .replace(/[\u{FE00}-\u{FE0F}]/gu, "") // Variation selectors
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, "") // Supplemental Symbols
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, "") // Chess Symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, "") // Symbols and Pictographs Extended-A
        .replace(/[\u{200D}]/gu, "") // Zero-width joiner
        .trim()
}

export const generatePdf = async (editor: Editor, pdfName: string): Promise<void> => {
    if (!editor) {
        throw new Error("Editor instance is required")
    }

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
    })

    const config = DEFAULT_CONFIG

    // Add document header
    addDocumentHeader(doc, pdfName, config)

    // Get editor content
    const content = editor.getJSON()

    // Process content
    let yPosition = 50
    if (content?.content) {
        yPosition = renderNodes(doc, content.content, yPosition, config)
    }

    // Add page numbers
    addPageNumbers(doc)

    // Download the PDF
    const fileName = sanitizeFileName(pdfName)
    doc.save(`${fileName}.pdf`)
}

function addDocumentHeader(doc: jsPDF, title: string, config: PDFConfig): void {
    const cleanTitle = cleanTextForPDF(title)

    // Project title
    doc.setFontSize(22)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(40, 40, 40)
    doc.text(cleanTitle, config.leftMargin, 25)

    // Generation date
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(120, 120, 120)
    const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
    doc.text(`Generated: ${dateStr}`, config.leftMargin, 32)

    // Separator line
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.line(config.leftMargin, 38, config.rightMargin, 38)
}

function renderNodes(doc: jsPDF, nodes: TipTapNode[], y: number, config: PDFConfig): number {
    let currentY = y

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        if (!node) continue

        // Check if we need a new page
        currentY = checkPageBreak(doc, currentY, config, 20)

        switch (node.type) {
            case "heading":
                currentY = renderHeading(doc, node, currentY, config)
                break

            case "paragraph":
                currentY = renderParagraph(doc, node, currentY, config)
                break

            case "bulletList":
                currentY = renderBulletList(doc, node, currentY, config)
                break

            case "orderedList":
                currentY = renderOrderedList(doc, node, currentY, config)
                break

            case "blockquote":
                currentY = renderBlockquote(doc, node, currentY, config)
                break

            case "codeBlock":
                currentY = renderCodeBlock(doc, node, currentY, config)
                break

            case "horizontalRule":
                currentY = renderHorizontalRule(doc, currentY, config)
                break

            case "hardBreak":
                currentY += config.lineHeight
                break

            default:
                // Handle unknown node types by recursing into content
                if (node.content) {
                    currentY = renderNodes(doc, node.content, currentY, config)
                }
                break
        }
    }

    return currentY
}

function renderHeading(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig): number {
    const level = (node.attrs?.level || 1) as 1 | 2 | 3 | 4 | 5 | 6
    const fontSize = config.fontSize[`h${level}`] || config.fontSize.normal
    const text = cleanTextForPDF(extractTextContent(node))

    if (!text.trim()) return y

    let currentY = checkPageBreak(doc, y, config, fontSize * 2)

    doc.setFontSize(fontSize)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(30, 30, 30)

    const lines = doc.splitTextToSize(text, config.rightMargin - config.leftMargin)

    for (const line of lines) {
        currentY = checkPageBreak(doc, currentY, config, fontSize)
        doc.text(line, config.leftMargin, currentY)
        currentY += fontSize * 0.5 // Adjust spacing based on font size
    }

    // Reset font
    doc.setFont("helvetica", "normal")
    doc.setFontSize(config.fontSize.normal)
    doc.setTextColor(0, 0, 0)

    return currentY + (level <= 2 ? 10 : 6)
}

function renderParagraph(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig): number {
    if (!node.content || node.content.length === 0) {
        return y + config.lineHeight
    }

    let currentY = y

    for (const childNode of node.content) {
        if (childNode.type === "text" && childNode.text) {
            const cleanText = cleanTextForPDF(childNode.text)

            if (!cleanText.trim()) continue

            const { font, fontSize, color } = getTextStyle(childNode.marks)

            doc.setFont("helvetica", font)
            doc.setFontSize(fontSize)
            doc.setTextColor(color[0], color[1], color[2])

            const lines = doc.splitTextToSize(cleanText, config.rightMargin - config.leftMargin)

            for (const line of lines) {
                currentY = checkPageBreak(doc, currentY, config, config.lineHeight)
                doc.text(line, config.leftMargin, currentY)
                currentY += config.lineHeight
            }
        } else if (childNode.type === "hardBreak") {
            currentY += config.lineHeight
        }
    }

    // Reset to default
    doc.setFont("helvetica", "normal")
    doc.setFontSize(config.fontSize.normal)
    doc.setTextColor(0, 0, 0)

    return currentY + 3
}

function renderBulletList(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig): number {
    if (!node.content) return y

    let currentY = y

    for (const listItem of node.content) {
        if (listItem.type === "listItem") {
            currentY = renderListItem(doc, listItem, currentY, config, "•")
        }
    }

    return currentY + 5
}

function renderOrderedList(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig): number {
    if (!node.content) return y

    let currentY = y
    const startNum = node.attrs?.start || 1

    for (let i = 0; i < node.content.length; i++) {
        const listItem = node.content[i]
        if (listItem.type === "listItem") {
            currentY = renderListItem(doc, listItem, currentY, config, `${startNum + i}.`)
        }
    }

    return currentY + 5
}

function renderListItem(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig, bullet: string): number {
    let currentY = checkPageBreak(doc, y, config, config.lineHeight * 2)

    // Render bullet/number
    doc.setFont("helvetica", "normal")
    doc.setFontSize(config.fontSize.normal)
    doc.setTextColor(0, 0, 0)
    doc.text(bullet, config.leftMargin, currentY)

    // Calculate indent for wrapped text
    const bulletWidth = bullet.length > 1 ? 10 : 6
    const textIndent = config.leftMargin + bulletWidth

    if (node.content) {
        const text = cleanTextForPDF(extractTextContent(node))
        if (text.trim()) {
            const lines = doc.splitTextToSize(text, config.rightMargin - textIndent)

            for (let i = 0; i < lines.length; i++) {
                currentY = checkPageBreak(doc, currentY, config, config.lineHeight)
                doc.text(lines[i], textIndent, currentY)
                if (i < lines.length - 1) {
                    currentY += config.lineHeight
                }
            }
        }
    }

    return currentY + config.lineHeight + 2
}

function renderBlockquote(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig): number {
    const text = cleanTextForPDF(extractTextContent(node))
    if (!text.trim()) return y

    let currentY = checkPageBreak(doc, y, config, 20)

    // Calculate blockquote dimensions
    const quoteIndent = config.leftMargin + 8
    const lines = doc.splitTextToSize(text, config.rightMargin - quoteIndent - 5)
    const blockHeight = lines.length * 6 + 6

    // Draw left border
    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(1)
    doc.line(config.leftMargin + 2, currentY - 2, config.leftMargin + 2, currentY + blockHeight - 4)

    // Render quote text
    doc.setFont("helvetica", "italic")
    doc.setFontSize(11)
    doc.setTextColor(70, 70, 70)

    for (const line of lines) {
        currentY = checkPageBreak(doc, currentY, config, 6)
        doc.text(line, quoteIndent, currentY)
        currentY += 6
    }

    // Reset styles
    doc.setFont("helvetica", "normal")
    doc.setFontSize(config.fontSize.normal)
    doc.setTextColor(0, 0, 0)

    return currentY + 6
}

function renderCodeBlock(doc: jsPDF, node: TipTapNode, y: number, config: PDFConfig): number {
    const code = cleanTextForPDF(extractTextContent(node))
    if (!code.trim()) return y

    const lines = code.split("\n")
    const blockHeight = lines.length * 5.5 + 8

    let currentY = checkPageBreak(doc, y, config, blockHeight)

    // Draw background
    doc.setFillColor(248, 248, 248)
    doc.roundedRect(config.leftMargin, currentY - 4, config.rightMargin - config.leftMargin, blockHeight, 2, 2, "F")

    // Draw border
    doc.setDrawColor(220, 220, 220)
    doc.setLineWidth(0.5)
    doc.roundedRect(config.leftMargin, currentY - 4, config.rightMargin - config.leftMargin, blockHeight, 2, 2, "S")

    // Render code
    doc.setFont("courier", "normal")
    doc.setFontSize(config.fontSize.code)
    doc.setTextColor(50, 50, 50)

    for (const line of lines) {
        currentY = checkPageBreak(doc, currentY, config, 5.5)
        doc.text(line || " ", config.leftMargin + 4, currentY)
        currentY += 5.5
    }

    // Reset styles
    doc.setFont("helvetica", "normal")
    doc.setFontSize(config.fontSize.normal)
    doc.setTextColor(0, 0, 0)

    return currentY + 8
}

function renderHorizontalRule(doc: jsPDF, y: number, config: PDFConfig): number {
    const currentY = checkPageBreak(doc, y, config, 10)

    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(config.leftMargin + 20, currentY + 3, config.rightMargin - 20, currentY + 3)

    return currentY + 12
}

function checkPageBreak(doc: jsPDF, y: number, config: PDFConfig, requiredSpace = 20): number {
    if (y + requiredSpace > config.pageHeight) {
        doc.addPage()
        return config.topMargin
    }
    return y
}

function extractTextContent(node: TipTapNode): string {
    if (!node) return ""

    if (node.type === "text" && node.text) {
        return node.text
    }

    if (node.content) {
        return node.content.map((child) => extractTextContent(child)).join("")
    }

    return ""
}

function getTextStyle(marks?: Mark[]): {
    font: "normal" | "bold" | "italic" | "bolditalic"
    fontSize: number
    color: [number, number, number]
} {
    const style = {
        font: "normal" as "normal" | "bold" | "italic" | "bolditalic",
        fontSize: 12,
        color: [0, 0, 0] as [number, number, number],
    }

    if (!marks || marks.length === 0) return style

    let isBold = false
    let isItalic = false
    let isCode = false

    for (const mark of marks) {
        switch (mark.type) {
            case "bold":
                isBold = true
                break
            case "italic":
                isItalic = true
                break
            case "code":
                isCode = true
                style.fontSize = 11
                style.color = [100, 50, 150]
                break
            case "strike":
                style.color = [150, 150, 150]
                break
            case "link":
                style.color = [0, 100, 200]
                break
        }
    }

    if (isBold && isItalic) {
        style.font = "bolditalic"
    } else if (isBold) {
        style.font = "bold"
    } else if (isItalic) {
        style.font = "italic"
    }

    return style
}

function addPageNumbers(doc: jsPDF): void {
    const totalPages = (doc as any).internal.pages.length - 1

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(150, 150, 150)
        doc.text(`Page ${i} of ${totalPages}`, 105, 287, { align: "center" })
    }
}

function sanitizeFileName(name: string): string {
    return cleanTextForPDF(name)
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .substring(0, 50)
        .replace(/^-+|-+$/g, "")
}
