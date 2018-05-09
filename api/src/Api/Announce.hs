module Api.Announce (API, server) where

--import Control.Monad.Trans.Reader
import Database.Persist.Sqlite
import Servant

import Model
import Utils

type API =
        "all"
      :> Get '[JSON] [Entity Announce]
    :<|> "new"
      :> ReqBody '[JSON] Announce
      :> Post '[JSON] (Key Announce)
    :<|> "delete"
      :> Capture "id" (Key Announce)
      :> Delete '[JSON] ()
    :<|> "update"
      :> Capture "id" (Key Announce)
      :> ReqBody '[JSON] Announce
      :> Post '[JSON] ()    
    
server :: PrivateServer API
server = myAnnounces
    :<|> newAnnounce
    :<|> deleteAnnounce
    :<|> updateAnnounce
  where    
    myAnnounces = db $ selectList [] []
    newAnnounce = db . insert
    deleteAnnounce = db . delete
    updateAnnounce aid = db . replace aid
