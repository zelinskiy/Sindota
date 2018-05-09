module Api.Question (API, server) where

--import Control.Monad.Trans.Reader
import Database.Persist.Sqlite
import Servant

import Model
import Utils

type API =
        "asked"
      :> Get '[JSON] [Entity Question]
    :<|> "pending"
      :> Get '[JSON] [Entity Question]
    :<|> "respond"
      :> Capture "id" (Key Question)
      :> Capture "text" String
      :> Post '[JSON] ()
    :<|> "new"
      :> ReqBody '[JSON] Question
      :> Post '[JSON] (Key Question)
    :<|> "delete"
      :> Capture "id" (Key Question)
      :> Delete '[JSON] () 
    
server :: PrivateServer API
server = askedQuestions
    :<|> pendingQuestions
    :<|> respondQuestion
    :<|> newQuestion
    :<|> deleteQuestion
  where    
    askedQuestions = db $ selectList [] []
    pendingQuestions = db $ selectList [] []
    respondQuestion = undefined
    newQuestion = db . insert
    deleteQuestion = db . delete
