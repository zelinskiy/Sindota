{-# LANGUAGE LambdaCase #-}

module Api.Tournament (API, server) where

import Control.Monad.Trans.Reader
import Data.Maybe

import Database.Persist.Sqlite
import Servant

import Model
import JsonModel
import Utils

type API =
        "all"
      :> Get '[JSON] [FullTournament]
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
        :>("registered" :> Get '[JSON] [FullTournament]
      :<|> "created"    :> Get '[JSON] [FullTournament]
      :<|> "selected"   :> Get '[JSON] (Maybe FullTournament))
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
    allTournaments = db (selectList [] [Asc TournamentAt])
                     >>= sequence . map fulfillTournament
    newTournament t = do
      me <- entityKey <$> ask
      let t' = t { tournamentAuthor = me
                 , tournamentStatus = Default }
      db $ insert t'
    deleteTournament = db . delete
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
    selectTournament tid = do
      me <- entityKey <$> ask
      db $ insert $ TournamentSelection me tid
      return ()
    myRegistered = do
      me <- entityKey <$> ask
      myRegs <- db $ map (tournamentRegistrationTournament . entityVal)
                <$> selectList [TournamentRegistrationUser ==. me] []
      db (selectList [TournamentId <-. myRegs] [Asc TournamentAt])
        >>= sequence . map fulfillTournament
    myCreated = do
      me <- entityKey <$> ask
      db (selectList [TournamentAuthor ==. me] [Asc TournamentAt])
        >>= sequence . map fulfillTournament
    mySelected = do
      me <- entityKey <$> ask
      mySelection <- db $ fmap (tournamentSelectionTournament . entityVal)
                <$> selectFirst [TournamentSelectionUser ==. me] []
      case mySelection of
        Just tid -> db (selectFirst [TournamentId ==. tid] [Asc TournamentAt])
          >>= \case
            Just t -> Just <$> fulfillTournament t
            Nothing -> return Nothing
        Nothing -> return Nothing
    promoteTournament = undefined

    fulfillTournament t = do
      let tid = entityKey t
          tv = entityVal t
      g <- db $ fromMaybe (error "CANT FIND GAME")
        <$> get (tournamentGame tv)
      a <- db $ fromMaybe (error "CANT FIND AUTHOR")
        <$> get (tournamentAuthor tv)
      cnt <- db $ count [TournamentRegistrationTournament ==. tid]
      return $ FullTournament 
        { tournament = tv
        , game = g
        , author = a
        , registeredCount = cnt }
