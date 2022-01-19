import {Configuration, V0alpha2Api} from "@ory/kratos-client";
import {NextFunction, Request, Response} from "express";

// Initializes the Ory SDK
const ory = new V0alpha2Api(new Configuration({
  // The Ory Proxy runs on http://localhost:4000/
  // and proxies requests to /.ory/* to Ory's APIs.
  basePath: "http://localhost:4000/.ory",
}))

// Beautifies any JSON string.
const prettyJson = (json: any) => JSON.stringify(json, null, 2)

// This route handles the /protected page.
export const handleProtected = async (req: Request, res: Response, next: NextFunction) => {
  // Unfortunately @types/express-jwt doesn't have proper typings for this.
  const user = req.user as any

  // We create a logout URL for the user
  const logoutUrl = await ory.createSelfServiceLogoutFlowUrlForBrowsers(req.header('cookie'))
    .then(({data}) => data.logout_url)
    .catch((err) => next('Unable to get logout URL from Ory Cloud: ' + err))
  // console.log(prettyJson(user.session.identity.traits.email))
  res.render('documentation', {
    headers: prettyJson(req.headers),
    user_email: user.session.identity.traits.email,
    claims: prettyJson(user),
    title:"Documentation",
    logoutUrl,
  })
}
