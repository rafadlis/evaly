import { getCloudflareContext } from "@opennextjs/cloudflare"

export const GET=async (req:Request)=>{
    if (req.url.includes("fahrezi")){
        return new Response(JSON.stringify(getCloudflareContext()))
    }
    return new Response("Hello World")
}
