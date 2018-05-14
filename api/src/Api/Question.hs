module Api.Question (API, server) where

import Control.Monad.Trans.Reader
import Database.Persist.Sqlite
import Servant
import Data.Maybe

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
    askedQuestions = do
      me <- ask
      db $ selectList [QuestionUser ==. entityKey me] []

    pendingQuestions = do
      me <- ask
      myTournamentsIds <-
        db $ map entityKey <$> selectList
        [TournamentAuthor ==. entityKey me] []
      db $ selectList
        [ QuestionTournament <-. myTournamentsIds
        , QuestionAnswer ==. Nothing ] []

    respondQuestion qid txt = do
      me <- ask
      mbQuestion <- db $ selectFirst
        [ QuestionId ==. qid ] []
      case mbQuestion of
        Nothing -> throwError $ err403
          { errBody = "Question not found" }
        Just q -> do
          t <- db $ fromJust <$> selectFirst
            [ TournamentId ==. questionTournament (entityVal q) ] []
          if (tournamentAuthor (entityVal t) /= entityKey me)
          then throwError $ err403
            { errBody = "You are not allowed to answer" }
          else db $ update qid [QuestionAnswer =. Just txt] 

    newQuestion q = do
      me <- ask
      mbTournament <- db $ get (questionTournament q)
      case mbTournament of
        Nothing -> throwError $ err403
          { errBody = "Tournament not found" }
        Just _ ->
          let q' = q { questionUser = entityKey me
                     , questionAnswer = Nothing }
          in db $ insert q'

    deleteQuestion qid = do
      me <- ask
      mbQuestion <- db $ selectFirst
        [ QuestionId ==. qid ] []
      case mbQuestion of
        Nothing -> throwError $ err403
          { errBody = "Question not found" }
        Just q -> do
          t <- db $ fromJust <$> selectFirst
            [ TournamentId ==. questionTournament (entityVal q) ] []
          if (tournamentAuthor (entityVal t) /= entityKey me
               && questionUser (entityVal q) /= entityKey me)
          then throwError $ err403
            { errBody = "You are not allowed to delete" }
          else db $ delete qid 
