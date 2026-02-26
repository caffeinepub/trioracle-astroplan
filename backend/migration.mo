import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Storage "blob-storage/Storage";
import Time "mo:core/Time";
import Authorization "authorization/access-control";

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

  type OldInquiry = {
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
  };

  type NewInquiry = {
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
    inquiries : Map.Map<Nat, OldInquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextPostId : Nat;
    nextInquiryId : Nat;
    accessControlState : Authorization.AccessControlState;
    services : List.List<Service>;
  };

  type NewActor = {
    posts : Map.Map<Nat, Post>;
    inquiries : Map.Map<Nat, NewInquiry>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextPostId : Nat;
    nextInquiryId : Nat;
    accessControlState : Authorization.AccessControlState;
    services : List.List<Service>;
  };

  public func run(old : OldActor) : NewActor {
    let newInquiries = old.inquiries.map<Nat, OldInquiry, NewInquiry>(
      func(_id, oldInquiry) {
        { oldInquiry with seedNumber = null };
      }
    );
    { old with inquiries = newInquiries };
  };
};
