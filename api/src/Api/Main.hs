{-# OPTIONS_GHC  -fno-warn-warnings-deprecations #-}
module Api.Main(API, server) where

import Database.Persist.Sqlite
import Servant
import Servant.Auth.Server
import Servant.Utils.Enter

import qualified Api.User
import qualified Api.AuthJWT
import qualified Api.Auth
import qualified Api.Admin
import qualified Api.Tournament
import qualified Api.Game
import qualified Api.Question
import qualified Api.Announce

import Model
import Utils

type API = 
       "public"   :> PublicApi
  :<|> "private"  :> Api.AuthJWT.Private :> PrivateApi
  :<|> "private2" :> Api.Auth.Private    :> PrivateApi
type PublicApi =
       "greeting" :> Get '[JSON] String
  :<|> "user"     :> Api.User.PublicAPI
  :<|> "jwt"      :> Api.AuthJWT.PublicAPI

type PrivateApi =
       "user"       :> Api.User.API
  :<|> "admin"      :> Api.Admin.API
  :<|> "tournament" :> Api.Tournament.API
  :<|> "game"       :> Api.Game.API
  :<|> "question"   :> Api.Question.API
  :<|> "announce"   :> Api.Announce.API
  
server :: ConnectionPool
       -> CookieSettings
       -> JWTSettings
       -> Server API
server p c jwt = publicServer p c jwt
                 :<|> privateServer p
                 :<|> privateServer p . Authenticated

publicServer :: ConnectionPool
             -> CookieSettings
             -> JWTSettings
             -> Server PublicApi
publicServer p c jwt = enter (publicToNormalH p) $
       return "Greetings!"
  :<|> Api.User.publicServer
  :<|> Api.AuthJWT.publicServer c jwt

privateServer :: ConnectionPool
              -> AuthResult (Entity User)
              -> Server PrivateApi
privateServer p (Authenticated u) =
  enter (privateToPublicH u `ver` publicToNormalH p) $
       Api.User.server
  :<|> Api.Admin.server
  :<|> Api.Tournament.server
  :<|> Api.Game.server
  :<|> Api.Question.server
  :<|> Api.Announce.server
privateServer _ _ = throwAll err401
