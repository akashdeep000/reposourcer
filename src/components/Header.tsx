'use client'

import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast";
import { FormEvent, useState } from "react";

export default function Header() {
    const ISBROWSER = typeof window !== "undefined";
    const [open, setOpen] = useState<boolean>(false)
    const getApiKey = (): string => {
        // get the api key from local storage
        if (ISBROWSER) return localStorage.getItem("apiKey") || ""
        return ""
    }

    const [apiKey, setApiKey] = useState<string>(getApiKey())

    const saveApiKey = (event: FormEvent) => {
        event.preventDefault()
        if (!ISBROWSER) return
        // save the api key to local storage
        localStorage?.setItem("apiKey", apiKeyInput)
        setApiKey(apiKey)
        toast({ title: "API Key Saved" })
        setOpen(false)
    }

    const [apiKeyInput, setApiKeyInput] = useState<string>(getApiKey())

    return (
        <div className="flex justify-between items-center px-4 py-2 shadow-sm">
            <h1 className="text-xl font-bold">RepoSourcer</h1>
            <div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default">{apiKey ? "Change" : "Add"} API Key</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add API Key</DialogTitle>
                            <DialogDescription>
                                Add your API key to get started.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="">
                            <form className="grid grid-cols-[1fr_auto] gap-2" onSubmit={saveApiKey}>
                                <Input placeholder="API Key" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} />
                                <Button type="submit">Save</Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
// ex