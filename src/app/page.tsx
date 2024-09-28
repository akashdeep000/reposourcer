'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";
import { RateLimit, Stargazer, StargazersData } from "../../types";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hook/useLocalStorage";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [stargazers, setStargazers] = useState<Stargazer[]>([]);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [filteredStargazers, setFilteredStargazers] = useState(stargazers)
  const [needEmail, setNeedEmail] = useState<boolean>(false)
  const [needLocation, setNeedLocation] = useState<boolean>(false)
  const [rateLimit, setRateLimit] = useState<RateLimit | undefined>()
  const [total, setTotal] = useState<number>(0)
  const [cursor, setCursor] = useState<string | null>(null)
  const [isAllLoading, setIsAllLoading] = useState<boolean>(false)
  const [apiKey, setApiKey] = useLocalStorage<string | null>("apiKey", null)
  
  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${apiKey}`,
    },
  });

  const githubRepoRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const getRepoFromUrl = (url: string) => {
    const match = url.match(githubRepoRegex);
    if (match && match.length === 3) {
      return { owner: match[1], repo: match[2] };
    } else {
      throw new Error("Invalid GitHub repository URL");
    }
  };

  const getStargazers = async (url: string, cursor: string | null = null) => {
    const { owner, repo } = getRepoFromUrl(url);
    console.log(owner, repo);
    const after = cursor ? `"${cursor}"` : null;
    const result = await graphqlWithAuth(`
      {
        repository(owner: "${owner}", name: "${repo}") {
          stargazers(first: 100, after: ${after}) {
            totalCount
            nodes {
              avatarUrl
              name
              url
              followers {
                totalCount
              }
              company
              email
              location
              websiteUrl
              twitterUsername
              repositories {
                totalCount
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
        rateLimit {
          cost
          remaining
          limit
          resetAt
        }
      }
    `) as StargazersData;
    setRateLimit(result.rateLimit)
    setTotal(total => result.repository?.stargazers.totalCount || total)
    return result
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apiKey) {
      return toast({
        title: "Set API key on the header section",
        variant: "destructive"
      })
    }
    (async () => {
      setStargazers([])
      setCursor(null)
      setIsAllLoading(false)
      setInitLoading(true);
      try {
        const result = await getStargazers(repoUrl)
        if (result.repository) {
          setStargazers(result.repository.stargazers.nodes);
          if (result.repository.stargazers.pageInfo.hasNextPage) {
            setCursor(result.repository.stargazers.pageInfo.endCursor)
          }
        }
      } catch (error: any) {
        console.log(error);
        toast({
          title: "Error",
          description: error?.message,
          variant: "destructive"
        })
      }
      setInitLoading(false);
    })()
  };

  useEffect(() => {
    setFilteredStargazers(stargazers.filter(stargazer => {
      if (needEmail && needLocation) {
        return stargazer.email && stargazer.location
      }
      if (needEmail) {
        return stargazer.email
      }
      if (needLocation) {
        return stargazer.location
      }
      return true
    }))
  }, [needEmail, needLocation, stargazers])

  useEffect(() => {
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
        `) as {
          rateLimit: RateLimit
        };
        setRateLimit(result.rateLimit)
      } catch (error: any) {
        console.log(error);
        toast({
          title: "Error",
          description: error?.message,
          variant: "destructive"
        })
      }
    })()
  }, [])

  const addPage = async (repoUrl: string, cursor: string) => {
    const result = await getStargazers(repoUrl, cursor)
    if (result.repository) {
      setStargazers(stargazers => [...stargazers, ...result.repository?.stargazers.nodes || []]);
      if (result.repository.stargazers.pageInfo.hasNextPage) {
        setCursor(result.repository.stargazers.pageInfo.endCursor)
      } else {
        setCursor(null)
        setIsAllLoading(false)
      }
    }
  }

  useEffect(() => {
    if (!cursor || !isAllLoading) return
    (async () => {
      await addPage(repoUrl, cursor)
    })()
  }, [isAllLoading, cursor])


  return (
    <div className="p-4">
      <div className="grid place-items-center sm:mt-4">
        <form onSubmit={handleSubmit} className="grid gap-2 sm:grid-cols-[1fr_auto] w-full max-w-prose">
          <Input type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/user/repo" />
          <Button disabled={!(repoUrl.match(githubRepoRegex)?.length === 3)} type="submit">
            {
              initLoading ? (<div className="flex gap-2 items-center"><p>Loading...</p><Loader2 size={18} className="animate-spin" /></div>) : "Get Stargazers"
            }
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-2">
          {rateLimit && `Rate Limit: ${rateLimit.remaining}/${rateLimit.limit} (Resets at ${new Date(rateLimit.resetAt).toLocaleString()})`}
        </p>
      </div>
      <div className="">
        {total ?
          (<div className="mt-4">
            <Progress value={(stargazers.length / total) * 100} className="w-full" />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm">
                {stargazers.length} / {total}
              </p>
              <Button disabled={total === stargazers.length} variant="default" onClick={() => setIsAllLoading(!isAllLoading)}>{stargazers.length === total ? "Completed" : !isAllLoading && stargazers.length <= 100 ? "Load All" : isAllLoading ? "Pause" : "Resume"}</Button>
            </div>
          </div>) : null
        }
        <div className="flex gap-4 px-2 mt-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="needEmail"
              checked={needEmail}
              onCheckedChange={(value) => setNeedEmail(!!value)}
            />
            <Label htmlFor="needEmail">Need Email</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="needLocation"
              checked={needLocation}
              onCheckedChange={(value) => setNeedLocation(!!value)}
            />
            <Label htmlFor="needLocation">Need Location</Label>
          </div>
          <p>
            Total: {filteredStargazers.length}
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={filteredStargazers} />
    </div>
  )
}