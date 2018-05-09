{-# LANGUAGE TemplateHaskell #-}
module Model.TournamentStatus where

import Database.Persist.TH
import Prelude
import GHC.Generics
import Data.Aeson

data TournamentStatus
  = Default
  | Promoted
    deriving (Show, Read, Eq, Ord, Generic)
derivePersistField "TournamentStatus"

instance ToJSON TournamentStatus
instance FromJSON TournamentStatus
