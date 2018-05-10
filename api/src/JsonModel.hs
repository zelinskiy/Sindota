{-# LANGUAGE DuplicateRecordFields #-}
 
module JsonModel where

import GHC.Generics (Generic)
import Data.Aeson (FromJSON, ToJSON)
import Database.Persist
import Model

data Login = Login
  { email :: String
  , pass :: String
  } deriving (Eq, Show, Generic)

instance ToJSON Login
instance FromJSON Login

data RegisterData = RegisterData
  { email :: String
  , pass  :: String
  } deriving (Eq, Show, Generic)

instance ToJSON RegisterData
instance FromJSON RegisterData


data FullTournament
  = FullTournament
    { tournament :: Entity Tournament
    , game :: Entity Game
    , author :: Entity User
    , registeredCount :: Int
    } deriving (Eq, Show, Generic)

instance ToJSON FullTournament
instance FromJSON FullTournament
