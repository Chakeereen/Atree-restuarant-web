'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface ConfirmModalProps {
  title?: string
  description?: string
  onConfirm: () => void
  trigger: React.ReactNode
}

export const ConfirmModal = ({ title = "Are you sure?", description, onConfirm, trigger }: ConfirmModalProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setIsOpen(false)
  }

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{trigger}</span>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {description && <p className="my-2 text-sm text-gray-600">{description}</p>}
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
