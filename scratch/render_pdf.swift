// Renderiza cada pagina del PDF a PNG con PDFKit y extrae su texto.
// uso: render_pdf <entrada.pdf> <directorio_salida>
import Foundation
import PDFKit
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("uso: render_pdf <entrada.pdf> <directorio_salida>")
    exit(1)
}
let inURL = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])
try? FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

guard let doc = PDFDocument(url: inURL) else {
    print("ERROR: no se pudo abrir el PDF")
    exit(1)
}

print("paginas: \(doc.pageCount)\n")

for i in 0..<doc.pageCount {
    guard let page = doc.page(at: i) else { continue }
    let mb = page.bounds(for: .mediaBox)
    let rot = page.rotation
    print("=== PAGINA \(i + 1) ===")
    print("  mediaBox: \(Int(mb.width)) x \(Int(mb.height)) pt   rotacion: \(rot)")

    // --- render ---
    let targetW: CGFloat = 1500
    let scale = targetW / mb.width
    let size = CGSize(width: mb.width * scale, height: mb.height * scale)
    let img = page.thumbnail(of: size, for: .mediaBox)
    if let tiff = img.tiffRepresentation,
       let rep = NSBitmapImageRep(data: tiff),
       let png = rep.representation(using: .png, properties: [:]) {
        let out = outDir.appendingPathComponent(String(format: "page-%02d.png", i + 1))
        do {
            try png.write(to: out)
            print("  PNG: \(out.lastPathComponent)  \(Int(size.width))x\(Int(size.height))  \(png.count / 1024) KB")
        } catch {
            print("  ERROR al escribir PNG: \(error)")
        }
    }

    // --- texto ---
    if let txt = page.string {
        let limpio = txt.trimmingCharacters(in: .whitespacesAndNewlines)
        let out = outDir.appendingPathComponent(String(format: "page-%02d.txt", i + 1))
        try? limpio.write(to: out, atomically: true, encoding: .utf8)
        print("  TEXTO: \(limpio.count) caracteres -> \(out.lastPathComponent)")
    } else {
        print("  TEXTO: (ninguno; la pagina es solo imagenes)")
    }
    print("")
}
