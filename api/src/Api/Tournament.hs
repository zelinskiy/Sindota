module Api.Tournament (API, server) where

--import Control.Monad.Trans.Reader
import Database.Persist.Sqlite
import Servant

import Model
import Utils

type API =
        "all"
      :> Get '[JSON] [Entity Tournament]
    :<|> "new"
      :> ReqBody '[JSON] Tournament
      :> Post '[JSON] (Key Tournament)
    :<|> "delete"
      :> Capture "id" (Key Tournament)
      :> Delete '[JSON] ()
    :<|> "update"
      :> Capture "id" (Key Tournament)
      :> ReqBody '[JSON] Tournament
      :> Post '[JSON] ()
    :<|> "register"
      :> Capture "id" (Key Tournament)
      :> Post '[JSON] ()
    :<|> "unregister"
      :> Capture "id" (Key Tournament)
      :> Post '[JSON] ()
    :<|> "select"
      :> Capture "id" (Key Tournament)
      :> Post '[JSON] ()
    :<|> "my"
        :>("registered" :> Get '[JSON] [Entity Tournament]
      :<|> "created"    :> Get '[JSON] [Entity Tournament]
      :<|> "selected"   :> Get '[JSON] (Entity Tournament))
    :<|> "promote"
      :> Capture "key" String
      :> Post '[JSON] ()
    
    
server :: PrivateServer API
server = allTournaments
    :<|> newTournament
    :<|> deleteTournament
    :<|> updateTournament
    :<|> register
    :<|> unregister
    :<|> selectTournament
    :<|> (myRegistered :<|> myCreated :<|> mySelected)
    :<|> promoteTournament    
  where    
    allTournaments = db $ selectList [] []
    newTournament = db . insert
    deleteTournament = db . delete
    updateTournament tid = db . replace tid
    register = undefined
    unregister = undefined
    selectTournament = undefined
    myRegistered = undefined
    myCreated = undefined
    mySelected = undefined
    promoteTournament = undefined
