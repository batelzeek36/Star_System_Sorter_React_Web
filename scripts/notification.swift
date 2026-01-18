#!/usr/bin/env swift

import Cocoa
import Foundation

class NotificationWindow: NSWindow {
    override var canBecomeKey: Bool { return true }
    override var canBecomeMain: Bool { return true }
}

class TransparentNotification: NSObject, NSApplicationDelegate {
    var window: NSWindow?
    
    func show(message: String) {
        let app = NSApplication.shared
        app.setActivationPolicy(.accessory)
        app.delegate = self
        
        // Create window
        let screenFrame = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1920, height: 1080)
        let windowWidth: CGFloat = 300
        let windowHeight: CGFloat = 80
        let padding: CGFloat = 20
        
        let windowRect = NSRect(
            x: screenFrame.maxX - windowWidth - padding,
            y: screenFrame.maxY - windowHeight - padding,
            width: windowWidth,
            height: windowHeight
        )
        
        let window = NotificationWindow(
            contentRect: windowRect,
            styleMask: [.borderless],
            backing: .buffered,
            defer: false
        )
        
        window.backgroundColor = NSColor.black.withAlphaComponent(0.5)
        window.isOpaque = false
        window.level = .floating
        window.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        
        // Create content view
        let contentView = NSView(frame: NSRect(x: 0, y: 0, width: windowWidth, height: windowHeight))
        
        // Title label
        let titleLabel = NSTextField(labelWithString: "Kiro Agent")
        titleLabel.font = NSFont.boldSystemFont(ofSize: 14)
        titleLabel.textColor = .white
        titleLabel.frame = NSRect(x: 15, y: 45, width: 270, height: 20)
        titleLabel.isBezeled = false
        titleLabel.drawsBackground = false
        titleLabel.isEditable = false
        titleLabel.isSelectable = false
        contentView.addSubview(titleLabel)
        
        // Message label
        let messageLabel = NSTextField(labelWithString: message)
        messageLabel.font = NSFont.systemFont(ofSize: 12)
        messageLabel.textColor = .white
        messageLabel.frame = NSRect(x: 15, y: 20, width: 270, height: 20)
        messageLabel.isBezeled = false
        messageLabel.drawsBackground = false
        messageLabel.isEditable = false
        messageLabel.isSelectable = false
        contentView.addSubview(messageLabel)
        
        // Close button
        let closeButton = NSButton(frame: NSRect(x: windowWidth - 30, y: windowHeight - 30, width: 20, height: 20))
        closeButton.title = "×"
        closeButton.bezelStyle = .rounded
        closeButton.target = self
        closeButton.action = #selector(closeWindow(_:))
        closeButton.font = NSFont.systemFont(ofSize: 16)
        contentView.addSubview(closeButton)
        
        window.contentView = contentView
        self.window = window
        
        window.makeKeyAndOrderFront(nil)
        app.activate(ignoringOtherApps: true)
        
        app.run()
    }
    
    @objc func closeWindow(_ sender: Any) {
        window?.close()
        NSApp.terminate(nil)
    }
}

// Get message from command line argument or use default
let message = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Task completed successfully! ✨"

let notification = TransparentNotification()
notification.show(message: message)
