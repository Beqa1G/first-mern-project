import { object, string, TypeOf } from "zod";

const payload = {
    body : object({
        header: string({
            required_error: "header is required"
        }),
        Url: string({
            required_error: "URL is required"
        })
    })
}

const params = {
    params: object({
      linkId: string({
        required_error: "there is no link id",
      }),
    }),
  };

export const createLinkSchema =  object({
    ...payload
})  

export const updateLinkSchema = object({
    ...payload,
    ...params
})

export const deleteLinkSchema = object({
    ...params
})

export type deleteLinkInput = TypeOf<typeof deleteLinkSchema>
export type createLinkInput = TypeOf<typeof createLinkSchema>
export type updateLinkInput = TypeOf<typeof updateLinkSchema>