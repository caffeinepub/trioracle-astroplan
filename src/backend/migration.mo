import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";

import Authorization "authorization/access-control";
import Storage "blob-storage/Storage";

module {
  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    fee : Nat;
  };

  type Post = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    createdAt : Time.Time;
    published : Bool;
  };

  type Inquiry = {
    id : Nat;
    serviceType : Nat;
    visitorName : Text;
    dob : Text;
    tob : Text;
    question : Text;
    pastLifeNotes : Text;
    handPictureBlob : ?Storage.ExternalBlob;
    palmPhotos : [?Storage.ExternalBlob];
    relationshipPerson2Name : ?Text;
    relationshipPerson2Dob : ?Text;
    relationshipPerson2Tob : ?Text;
    submittedAt : Time.Time;
    birthCountry : ?Text;
    birthCity : ?Text;
    birthState : ?Text;
    seedNumber : ?Nat;
  };

  type UserProfile = {
    name : Text;
    email : Text;
  };

  type OldActor = {
    posts : Map.Map<Nat, Post>;
    inquiries : Map.Map<Nat, Inquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextPostId : Nat;
    nextInquiryId : Nat;
    accessControlState : Authorization.AccessControlState;
    services : List.List<Service>;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
