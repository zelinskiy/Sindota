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
import Data.Time.Clock

import Model.UserStatus as UserStatus
import Model.SecretKeyPurpose as SecretKeyPurpose
import Model.TournamentStatus as TournamentStatus

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
Tournament json
    author UserId
    at UTCTime
    status TournamentStatus
    game GameId
    reward Int
    description String
    deriving Eq Show
TournamentRegistration json
    user UserId
    tournament TournamentId
    Primary user tournament
    deriving Eq Show
TournamentSelection json
    user UserId
    tournament TournamentId
    Primary user
    deriving Eq Show
Game json
    name String
    description String
    deriving Eq Show
Question json
    user UserId
    tournament TournamentId
    answered Bool
    title String
    text String
    deriving Eq Show
Announce json
    tournament TournamentId
    title String
    text String
    deriving Eq Show
|]
