{-# LANGUAGE LambdaCase #-}

module Api.Tournament (API, server) where

import Control.Monad.Trans.Reader

import Data.Maybe
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
    :<|> "get"
      :> Capture "id" (Key Tournament)
      :> Post '[JSON] (Maybe (Entity Tournament))
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
    :<|> "registered"
      :> Capture "id" (Key Tournament)
      :> Post '[JSON] Bool
    :<|> "select"
      :> Capture "id" (Key Tournament)
      :> Post '[JSON] ()
    :<|> "unselect"
      :> Post '[JSON] ()
    :<|> "my"
        :>("registered" :> Get '[JSON] [Entity Tournament]
      :<|> "created"    :> Get '[JSON] [Entity Tournament]
      :<|> "selected"   :> Get '[JSON] (Maybe (Entity Tournament)))
    :<|> "promote"
      :> Capture "id" (Key Tournament)
      :> Capture "key" String
      :> Post '[JSON] ()
    :<|> "members"
      :> Capture "id" (Key Tournament)
      :> Get '[JSON] [Key User]

server :: PrivateServer API
server = allTournaments
    :<|> newTournament
    :<|> getTournament
    :<|> deleteTournament
    :<|> updateTournament
    :<|> register
    :<|> unregister
    :<|> isRegistered
    :<|> selectTournament
    :<|> unselectTournament
    :<|> (myRegistered :<|> myCreated :<|> mySelected)
    :<|> promoteTournament
    :<|> getMembers
  where    
    allTournaments = db $ selectList [] [Asc TournamentAt]
    newTournament t = do
      me <- entityKey <$> ask
      let t' = t { tournamentAuthor = me
                 , tournamentStatus = Default }
      db $ insert t'
    getTournament tid = db $ selectFirst [TournamentId ==. tid] []
    deleteTournament = db . deleteCascade
    updateTournament tid t = do
      me <- entityKey <$> ask
      mbTournament <- db $ selectFirst [TournamentId ==. tid] []
      case mbTournament of
        Nothing -> throwError $ err403
          { errBody = "Tournament not Found" }
        Just t' -> 
          if tournamentAuthor (entityVal t') /= me
          then throwError $ err403
               { errBody = "Only author allowed to edit" }
          else db $ replace tid t
    register tid = do
      me <- entityKey <$> ask
      db $ insert $ TournamentRegistration me tid
      return ()
    unregister tid = do
      me <- entityKey <$> ask
      db $ delete $ TournamentRegistrationKey me tid
      return ()
    isRegistered tid = do
      me <- entityKey <$> ask
      db $ isJust <$> selectFirst
        [ TournamentRegistrationUser ==. me
        , TournamentRegistrationTournament ==. tid] []
    selectTournament tid = do
      me <- entityKey <$> ask
      unselectTournament
      db $ insert $ TournamentSelection me tid
      return ()
    unselectTournament = do
      me <- entityKey <$> ask
      db $ deleteWhere
        [TournamentSelectionUser ==. me]
    myRegistered = do
      me <- entityKey <$> ask
      myRegs <- db $ map (tournamentRegistrationTournament . entityVal)
                <$> selectList [TournamentRegistrationUser ==. me] []
      db (selectList [TournamentId <-. myRegs] [Asc TournamentAt])
    myCreated = do
      me <- entityKey <$> ask
      db (selectList [TournamentAuthor ==. me] [Asc TournamentAt])
    mySelected = do
      me <- entityKey <$> ask
      mySelection <- db $ fmap (tournamentSelectionTournament . entityVal)
                <$> selectFirst [TournamentSelectionUser ==. me] []
      case mySelection of
        Just tid -> db (selectFirst [TournamentId ==. tid] [Asc TournamentAt])
          >>= \case
            Just t -> return $ Just t
            Nothing -> return Nothing
        Nothing -> return Nothing
    promoteTournament tid k = do
      mbKey <- db $ selectFirst
        [ SecretKeyValue ==. k
        , SecretKeyPurpose ==. PromoteTournament ] []
      mbTournament <- db $ selectFirst
        [TournamentId ==. tid] []
      
      case (mbKey, mbTournament) of
        (Nothing, _) -> throwError $ err403
          { errBody = "Key not Found" }
        (_, Nothing) ->  throwError $ err403
          { errBody = "Tournament not Found" }
        (Just key, Just t) -> db $ do          
          update (entityKey t) [TournamentStatus =. Promoted]
          delete (entityKey key)
    getMembers tid =
      db $ map (tournamentRegistrationUser . entityVal)
        <$> selectList [TournamentRegistrationTournament ==. tid] []
          
