{-# LANGUAGE FlexibleInstances #-}
{-# OPTIONS_GHC -fno-warn-orphans #-}

module Api.AuthJWT
  ( Login(..)
  , Private
  , PublicAPI
  , publicServer)
where

import Control.Monad.Trans (liftIO)
import Servant
import Servant.Auth.Server
import Servant.Auth.Server.SetCookieOrphan ()
import Database.Persist.Sqlite
import qualified Data.ByteString.Lazy.Char8 as BS
import qualified Data.Text as T

import Model
import JsonModel(Login(..))
import Utils

instance ToJWT (Entity User)
instance FromJWT (Entity User)

type Private = Auth '[JWT] (Entity User)

type PublicAPI =
 "login"
     :> ReqBody '[JSON] Login
     :> Post '[JSON]
          (Headers '[ Header "Set-Cookie" SetCookie
                    , Header "Set-Cookie" SetCookie]
           T.Text)

publicServer :: CookieSettings
             -> JWTSettings
             -> PublicServer PublicAPI
publicServer cs jwts (Login e p) = do
  mUsr <- db2 $ selectFirst [UserEmail ==. e] []
  mApplyCookies <- case mUsr of
     Nothing ->
       throwError $ err401
       { errBody = "Can't find user" }
     Just usr ->
       if userPassword (entityVal usr) == hash p
       then liftIO $ acceptLogin cs jwts usr
       else throwError $ err401
            { errBody = "Incorrect password" }
  Right jwt <- case mUsr of
    Nothing -> return $ Right ""
    Just u -> liftIO $ makeJWT u jwts Nothing
  case mApplyCookies of
    Nothing ->
      throwError $ err401
      { errBody = "Can't apply cookie" }
    Just applyCookies ->
      return $ applyCookies (T.pack (BS.unpack jwt))
       
