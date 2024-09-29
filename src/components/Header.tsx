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
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "@/hooks/use-toast";
import { graphql } from "@octokit/graphql";
import { FormEvent, useEffect, useState } from "react";

export default function Header() {
    const [open, setOpen] = useState<boolean>(false)
    const [apiKey, setApiKey] = useLocalStorage<string | null>("apiKey", null)
    const [apiKeyInput, setApiKeyInput] = useState<string>(apiKey || "")
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
      setIsClient(true)
    }, [])
    
    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${apiKeyInput}`,
        },
    });

    const saveApiKey = (event: FormEvent) => {
        event.preventDefault();
        (async () => {
            try {
                const result = await graphqlWithAuth(`
                    {
                      rateLimit {
                        cost
                        remaining
                        limit
                        resetAt
                      }
                    }
                  `)
                setApiKey(apiKeyInput)
                toast({ title: "API Key Saved" })
                setOpen(false)
            } catch (error: any) {
                console.log({error: error?.message});
                toast({
                    title: "Invalid API key",
                    variant: "destructive"
                })
            }
        })()
    }

    return (
        <div className="flex justify-between items-center px-4 py-2 shadow-sm">
            <h1 className="text-xl font-bold">RepoSourcer</h1>
            <div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                    {isClient ? 
                        <Button variant="default">{apiKey ? "Change" : "Add"} API Key</Button> : null
                    }
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add API Key</DialogTitle>
                            <DialogDescription>
                                Add your API key to get started.
                            </DialogDescription>typeof window
                        </DialogHeader>
                        <div className="">
                            <form className="grid grid-cols-[1fr_auto] gap-2" onSubmit={saveApiKey}>
                                <Input placeholder="API Key" value={apiKeyInput} onChange={(e) => setApiKeyInput(e.target.value)} />
                                <Button disabled={!apiKeyInput} type="submit">Save</Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
// ex