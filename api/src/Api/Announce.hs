module Api.Announce (API, server) where

import Database.Persist.Sqlite
import Servant
import Data.Time.Clock
import Control.Monad.Trans.Reader
import Control.Monad.IO.Class

import Model
import Utils

type API =
        "all"
      :> Get '[JSON] [Entity Announce]
    :<|> "new"
      :> ReqBody '[JSON] Announce
      :> Post '[JSON] (Key Announce)
    :<|> "get"
      :> Capture "id" (Key Announce)
      :> Get '[JSON] (Maybe (Entity Announce))
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
    :<|> getAnnounce
    :<|> deleteAnnounce
    :<|> updateAnnounce
  where    
    myAnnounces = do
      me <- ask
      myTournaments <- db $ selectList
          [TournamentRegistrationUser ==. entityKey me] []
      let myTournamentsIds =
            map (tournamentRegistrationTournament . entityVal) myTournaments
      db $ selectList
        [AnnounceTournament <-. myTournamentsIds]
        [Desc AnnounceAt]
    newAnnounce a = do
      me <- ask
      now <- liftIO getCurrentTime
      let a' = a { announceAt = now }
      mbTournament <- db $ selectFirst
        [TournamentId ==. announceTournament a] []
      case mbTournament of
        Nothing -> throwError $ err403
          { errBody = "Tournament not Found" }
        Just t -> if tournamentAuthor (entityVal t) /= entityKey me
          then throwError $ err403
               { errBody = "You are not an admin of this tournament" }
          else db $ insert a'
    getAnnounce aid = db $ selectFirst [AnnounceId ==. aid] []
    deleteAnnounce aid = do
      me <- ask
      mbAnnounce <- db $ selectFirst
        [AnnounceId ==. aid] []
      case mbAnnounce of
        Nothing -> throwError $ err403
          { errBody = "Announce not Found" }
        Just a -> do
          mbTournament <- db $ selectFirst
            [TournamentId ==. announceTournament (entityVal a)] []
          case mbTournament of
            Nothing -> throwError $ err403
              { errBody = "Tournament not Found" }
            Just t -> if tournamentAuthor (entityVal t) /= entityKey me
              then throwError $ err403
                   { errBody = "You are not an admin of this tournament" }
              else db $ delete aid
    updateAnnounce aid a' = do
      me <- ask
      mbAnnounce <- db $ selectFirst
        [AnnounceId ==. aid] []
      case mbAnnounce of
        Nothing -> throwError $ err403
          { errBody = "Announce not Found" }
        Just a -> do
          mbTournament <- db $ selectFirst
            [TournamentId ==. announceTournament (entityVal a)] []
          case mbTournament of
            Nothing -> throwError $ err403
              { errBody = "Tournament not Found" }
            Just t -> if tournamentAuthor (entityVal t) /= entityKey me
              then throwError $ err403
                   { errBody = "You are not an admin of this tournament" }
              else db $ replace aid a'
