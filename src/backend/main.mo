import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  // Timer session data
  type TimerSession = {
    startTime : Time.Time;
    endTime : Time.Time;
    duration : Int; // In nanoseconds
    labelText : Text; // e.g. "Pomodoro", "Custom"
    colorTheme : Text; // Color code/name
    tags : [Text]; // Subjects, projects, tasks
  };

  module TimerSession {
    public func compare(a : TimerSession, b : TimerSession) : Order.Order {
      Int.compare(a.startTime, b.startTime);
    };

    public func compareByLabel(a : TimerSession, b : TimerSession) : Order.Order {
      Text.compare(a.labelText, b.labelText);
    };
  };

  // Custom timer preset data
  type TimerPreset = {
    duration : Int; // Duration in nanoseconds
    labelText : Text; // Custom label text
    colorTheme : Text; // Color code/name
  };

  // Goal data
  type Goal = {
    targetHours : Float; // In hours
    targetType : GoalType;
    progress : Float; // Completed hours
    achieved : Bool;
    streak : Nat; // Consecutive goal achievements
  };

  type GoalType = { #Daily };

  let sessions = Map.empty<Time.Time, TimerSession>();
  let presets = Map.empty<Text, TimerPreset>();
  let goals = Map.empty<Text, Goal>();
  let userWallpapers = Map.empty<Text, Storage.ExternalBlob>();

  // Placeholder constructor for TimerSession
  func createTimerSession(startTime : Time.Time, endTime : Time.Time, labelText : Text, colorTheme : Text, tags : [Text]) : TimerSession {
    {
      startTime;
      endTime;
      duration = endTime - startTime;
      labelText;
      colorTheme;
      tags;
    };
  };

  // Record a study session (handles both old and new calls)
  public shared ({ caller }) func recordSession(startTime : Time.Time, endTime : Time.Time, labelText : ?Text, colorTheme : ?Text, tags : ?[Text]) : async () {
    if (endTime <= startTime) { Runtime.trap("End time must be after start time") };

    let finalLabelText = switch (labelText) {
      case (null) { "default" };
      case (?l) { l };
    };
    let finalColorTheme = switch (colorTheme) {
      case (null) { "blue" };
      case (?c) { c };
    };
    let finalTags = switch (tags) {
      case (null) { [] };
      case (?t) { t };
    };

    let session = createTimerSession(startTime, endTime, finalLabelText, finalColorTheme, finalTags);
    sessions.add(startTime, session);
  };

  // Custom Timer Presets
  public shared ({ caller }) func savePreset(name : Text, duration : Int, labelText : Text, colorTheme : Text) : async () {
    let preset : TimerPreset = {
      duration;
      labelText;
      colorTheme;
    };
    presets.add(name, preset);
  };

  public query ({ caller }) func getAllPresets() : async [TimerPreset] {
    presets.values().toArray();
  };

  // Goal Management
  public shared ({ caller }) func setGoal(name : Text, targetType : GoalType, targetHours : Float) : async () {
    let goal : Goal = {
      targetHours;
      targetType;
      progress = 0.0;
      achieved = false;
      streak = 0;
    };
    goals.add(name, goal);
  };

  public shared ({ caller }) func updateGoalProgress(name : Text, hours : Float) : async () {
    switch (goals.get(name)) {
      case (null) { Runtime.trap("Goal not found") };
      case (?goal) {
        let newProgress = goal.progress + hours;
        let achieved = newProgress >= goal.targetHours;
        let newStreak = if (achieved) { goal.streak + 1 } else { goal.streak };

        let updatedGoal : Goal = {
          goal with
          progress = newProgress;
          achieved;
          streak = newStreak;
        };

        goals.add(name, updatedGoal);
      };
    };
  };

  // Analytics Functions
  public query ({ caller }) func getSessionCount() : async Nat {
    sessions.size();
  };

  public query ({ caller }) func getAverageSessionDuration() : async Float {
    var total : Int = 0;
    for (session in sessions.values()) {
      total += session.duration;
    };
    if (sessions.size() == 0) { 0.0 } else {
      total.toFloat() / sessions.size().toFloat();
    };
  };

  public query ({ caller }) func getSessionsByLabel(labelText : Text) : async [TimerSession] {
    let filtered = sessions.values().toArray().filter(
      func(session) { session.labelText == labelText }
    );
    filtered.sort();
  };

  // Data Export
  public query ({ caller }) func exportSessions() : async [TimerSession] {
    sessions.values().toArray().sort();
  };

  public query ({ caller }) func exportPresets() : async [TimerPreset] {
    presets.values().toArray();
  };

  public query ({ caller }) func exportGoals() : async [Goal] {
    goals.values().toArray();
  };

  // Tag Filtering
  public query ({ caller }) func getSessionsByTag(tag : Text) : async [TimerSession] {
    let filtered = sessions.values().toArray().filter(
      func(session) {
        session.tags.find(func(t) { t == tag }) != null;
      }
    );
    filtered.sort();
  };

  public query ({ caller }) func getAllTags() : async [Text] {
    let tagList = List.empty<Text>();

    for (session in sessions.values()) {
      let sessionTags : [Text] = session.tags;
      tagList.addAll(sessionTags.values());
    };

    let tagsArray = tagList.toArray();
    let sortedTags = tagsArray.sort();

    let uniqueTagsList = List.empty<Text>();
    var lastTag : ?Text = null;
    for (tag in sortedTags.values()) {
      switch (lastTag) {
        case (null) {
          uniqueTagsList.add(tag);
        };
        case (?lt) {
          if (lt != tag) {
            uniqueTagsList.add(tag);
          };
        };
      };
      lastTag := ?tag;
    };

    uniqueTagsList.toArray();
  };

  // === Wallpapers Management ===

  public shared ({ caller }) func uploadWallpaper(name : Text, blob : Storage.ExternalBlob) : async () {
    userWallpapers.add(name, blob);
  };

  public query ({ caller }) func getWallpaper(name : Text) : async ?Storage.ExternalBlob {
    userWallpapers.get(name);
  };

  public query ({ caller }) func listWallpapers() : async [Text] {
    userWallpapers.keys().toArray();
  };

  // This returns all user wallpapers, allowing the frontend to handle the URL extraction
  public query ({ caller }) func getAllWallpapers() : async [(Text, Storage.ExternalBlob)] {
    userWallpapers.toArray();
  };
};
