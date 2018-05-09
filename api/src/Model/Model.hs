{-# LANGUAGE TemplateHaskell            #-}
{-# LANGUAGE QuasiQuotes                #-}
{-# LANGUAGE GADTs                      #-}
{-# LANGUAGE TypeFamilies               #-}
{-# LANGUAGE MultiParamTypeClasses      #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE OverloadedStrings          #-}
{-# LANGUAGE RecordWildCards            #-}
{-# LANGUAGE FlexibleInstances          #-}
{-# LANGUAGE DeriveGeneric              #-}

module Model.Model where

import Database.Persist.TH

import Model.UserStatus as UserStatus
import Model.SecretKeyPurpose as SecretKeyPurpose

share [mkPersist sqlSettings
      , mkDeleteCascade sqlSettings
      , mkMigrate "migrateAll"]
  [persistLowerCase|
User json
    email String
    password String
    status UserStatus
    Primary email
    deriving Eq Show
SecretKey json
    value String
    purpose SecretKeyPurpose
    deriving Eq Show
|]
