import 'phaser'
import SceneBase from './scene/SceneBase'
import UIUtils from './utils/UIUtils'
import CameraPluginBase from './camera/CameraPluginBase'
import CameraPluginManager from './camera/CameraPluginManager'
import InnerCameraPlugin from './camera/InnerCameraPlugin'
import OuterCameraPlugin from './camera/OuterCameraPlugin'
import SimpleCameraPlugin from './camera/SimpleCameraPlugin'
import Button from './components/Button'
import Switch from './components/Switch'
import UIComponent from './components/UIComponent'
import { AlignType } from './enum/AlignType'
import { EventTypes } from './enum/EventTypes'
import { PhaserEvents } from './enum/PhaserEvents'
import ExternalInterface from './external/ExternalInterface'
import ChosicModel from './gamedata/models/ChosicModel'
import LineModel from './gamedata/models/LineModel'
import GameDataModel from './gamedata/GameDataModel'
import DragHelper from './tools/DragHelper'
import PropupManager from './tools/PropupManager'
import Debug from './utils/Debug'
import SoundManager from './utils/SoundUtils'
import Utils from './utils/Utils'
import Layer from './components/Layer'
import ProgressBar from './components/ProgressBar'
import TagText from './components/TagText'
import Video from './components/Video'
import Audio from './components/Audio'
import PageTurn from './tools/PageTurn'
import List from './components/List'
import IListRender from './components/IListRender'
import Title from './components/Title'
import ScrollContainer from './components/ScrollContainer'
import BetterScroll from './components/BetterScroll'
import MultipleCameraPluginBase from './camera/MultipleCameraPluginBase'
import ResScene from './scene/ResScene'
import Arc from './graphics/Arc'
/* 题型模版相关 */
import BaseTopic from './gameTemplate/objects/BaseTopic'
import ObjectiveTopic from './gameTemplate/objects/ObjectiveTopic'
import SubjectiveTopic from './gameTemplate/objects/SubjectiveTopic'
import BaseOption from './gameTemplate/objects/BaseOption'
import TopicModel from './gameTemplate/models/Topic'
import MatchResultModel from './gameTemplate/models/MatchResult'
import OptionInterface from './gameTemplate/models/interface/IOption'

export {
  BetterScroll,
  CameraPluginBase,
  CameraPluginManager,
  InnerCameraPlugin,
  OuterCameraPlugin,
  SimpleCameraPlugin,
  MultipleCameraPluginBase,
  Button,
  Switch,
  UIComponent,
  AlignType,
  EventTypes,
  PhaserEvents,
  ExternalInterface,
  ChosicModel,
  LineModel,
  GameDataModel,
  ResScene,
  SceneBase,
  DragHelper,
  PropupManager,
  Debug,
  SoundManager,
  UIUtils,
  Utils,
  ProgressBar,
  Layer,
  PageTurn,
  TagText,
  Video,
  Audio,
  List,
  IListRender,
  Title,
  ScrollContainer,
  Arc,
  BaseTopic,
  ObjectiveTopic,
  SubjectiveTopic,
  BaseOption,
  TopicModel,
  MatchResultModel,
  OptionInterface
}
