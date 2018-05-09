{-# LANGUAGE DuplicateRecordFields #-}
 
module JsonModel where

import GHC.Generics (Generic)
import Data.Aeson (FromJSON, ToJSON)




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
