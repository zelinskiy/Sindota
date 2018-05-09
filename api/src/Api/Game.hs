module Api.Game (API, server) where

--import Control.Monad.Trans.Reader
import Database.Persist.Sqlite
import Servant

import Model
import Utils

type API =
        "all"
      :> Get '[JSON] [Entity Game]
    :<|> "new"
      :> ReqBody '[JSON] Game
      :> Post '[JSON] (Key Game)
    :<|> "delete"
      :> Capture "id" (Key Game)
      :> Delete '[JSON] ()
    :<|> "update"
      :> Capture "id" (Key Game)
      :> ReqBody '[JSON] Game
      :> Post '[JSON] ()    
    
server :: PrivateServer API
server = allGames
    :<|> newGame
    :<|> deleteGame
    :<|> updateGame
  where    
    allGames = db $ selectList [] []
    newGame = db . insert
    deleteGame = db . delete
    updateGame tid = db . replace tid
