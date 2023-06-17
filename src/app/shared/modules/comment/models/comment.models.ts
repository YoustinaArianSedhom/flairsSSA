export const REQUEST_ENDPOINT = 'Request'

export interface CommentBodyModel {
   requestId: string,
   commentBody: string,
}

export interface CommentResponseModel {
   createdDate: Date,
   createdBy: CreatedByModel,
   content: string
}

interface CreatedByModel {
   fullName: string,
   organizationEmail: string
}
