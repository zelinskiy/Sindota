module Api.User
    ( API
    , PublicAPI
    , server
    , publicServer
    ) where

import Database.Persist.Sqlite
import Servant
import Control.Monad.Trans.Reader
import Data.Char(isDigit)
import Data.Maybe(isJust)

import Model
import JsonModel(RegisterData(..))
import Utils

type API =
         "me"
      :> Get '[JSON] (Entity User)
    :<|> "unregister"
      :> Get '[JSON] ()
    :<|> "upgrade"
      :> Capture "purpose" SecretKeyPurpose
      :> Capture "key" String
      :> Get '[JSON] ()
    
type PublicAPI =
         "register"
      :> ReqBody '[JSON] RegisterData
      :> Post '[JSON] (Key User)

server :: PrivateServer API
server =
       getMyself
  :<|> unregister
  :<|> upgrade
  where
    getMyself = ask
    unregister = ask >>= \me -> db $ do      
      deleteCascade (entityKey me)
    upgrade SubscribeSilver k =  do
      mbKey <- db $ selectFirst
        [ SecretKeyValue ==. k
        , SecretKeyPurpose ==. SubscribeSilver ] []
      case mbKey of
        Nothing -> throwError $ err403
          { errBody = "Key not Found" }
        Just key -> ask >>= \me -> db $ do          
          update (entityKey me) [UserStatus =. Silver]
          delete (entityKey key)
      

publicServer :: PublicServer PublicAPI
publicServer = register
  where
    register RegisterData { email = e, pass = p } = do
      user <- db2 $ selectFirst [UserEmail ==. e] []      
      if isJust user
      then throwError $ err403
           { errBody = "User already registered" }
      else if length p < 7
      then throwError $ err403
           { errBody = "Password must be longer than 7 chars" }
      else if not (any isDigit p)
      then throwError $ err403
           { errBody = "Password must contain at least one digit" }
      else db2 $ insert $ User
           { userEmail = e
           , userPassword = hash p
           , userStatus = Normal }


     
