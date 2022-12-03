// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title EthProperty
 * @dev Property Management Smart Contract
 */
contract EthProperty {

    struct User {
        address userAddress;
        string name;
        string email;
        string phoneNumber;
        string[] propertyList;
        string[] buyOrders;
    }

    struct Property {
        string id;
        string name;
        string dimensions;
        string pincode;
        string propertyAddress;
        string lat;
        string lng;
        address currentOwner;
        address[] pastOwners;
    }

    struct BuyOrder {
        string orderId;
        string propertyId;
        address buyer;
        address currentOwner;
        string status;
    }

    mapping(address => User) public addressToUserMapping;
    mapping(address => bool) public userRegisteredMapping;

    string[] public propertyIds;
    mapping(string => Property) public idToPropertyMapping;

    mapping(string => BuyOrder) public orderIdToBuyOrderMapping;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier registeredUsers(address _userAddress)
    {
        require(userRegisteredMapping[_userAddress]);
        _;
    }

    function isUserRegistered(address _userAddress) 
    public view returns ( bool ) {
        return userRegisteredMapping[_userAddress];
    }

    function isUserAdmin(address _userAddress)
    public view returns ( bool ) {
        return admin == _userAddress;
    }

    function register(string memory _name, string memory _email, string memory _phoneNumber) 
    public {
        require(!userRegisteredMapping[msg.sender]);

        User memory newUser = User({
            userAddress: msg.sender,
            name: _name,
            email: _email,
            phoneNumber: _phoneNumber,
            propertyList: new string[](0),
            buyOrders: new string[](0)
        });

        addressToUserMapping[msg.sender] = newUser;
        userRegisteredMapping[msg.sender] = true;
    }

    function fetchUser(address _userAddress) 
    public registeredUsers(_userAddress) view returns (
        string memory, string memory, string memory, string[] memory, string[] memory
    ) {
        User memory user = addressToUserMapping[_userAddress];

        return (
            user.name,
            user.email,
            user.phoneNumber,
            user.propertyList,
            user.buyOrders
        );
    }

    function fetchProperty(string memory _id) 
    public registeredUsers(msg.sender) view returns (
        string memory, string memory, string memory, string memory, string memory, string memory, address, address[] memory
    ) {
        Property memory property = idToPropertyMapping[_id];

        return (
            property.name,
            property.dimensions,
            property.pincode,
            property.propertyAddress,
            property.lat,
            property.lng,
            property.currentOwner,
            property.pastOwners
        );
    }

    function fetchBuyOrder(string memory _orderId) 
    public registeredUsers(msg.sender) view returns (
        string memory, address, address, string memory
    ) {
        BuyOrder memory buyOrder = orderIdToBuyOrderMapping[_orderId];

        return (
            buyOrder.propertyId,
            buyOrder.buyer,
            buyOrder.currentOwner,
            buyOrder.status
        );
    }

    function fetchPropertyIds() 
    public registeredUsers(msg.sender) view returns (
        string[] memory 
    ) {
        return propertyIds;
    }

    function addProperty(string memory _id, string memory _name, string memory _dimensions, 
        string memory _pincode, string memory _propertyAddress, string memory _lat, string memory _lng) 
    public registeredUsers(msg.sender) {

        Property memory newProperty = Property({
            id: _id,
            name: _name,
            dimensions: _dimensions,
            pincode: _pincode,
            propertyAddress: _propertyAddress,
            lat: _lat,
            lng: _lng,
            currentOwner: msg.sender,
            pastOwners: new address[](0)
        });

        idToPropertyMapping[_id] = newProperty;
        propertyIds.push(_id);

        User storage user = addressToUserMapping[msg.sender];
        user.propertyList.push(_id);
    }

    function transferProperty(string memory _id, address _newOwner) 
    public registeredUsers(msg.sender) {
        require(userRegisteredMapping[_newOwner]);
        require(idToPropertyMapping[_id].currentOwner == msg.sender);

        Property storage property = idToPropertyMapping[_id];

        property.pastOwners.push(msg.sender);
        property.currentOwner = _newOwner;

        User storage oldUser = addressToUserMapping[msg.sender];

        delete oldUser.propertyList;

        for(uint i=0;i<oldUser.propertyList.length;i++) {
            if(keccak256(bytes (_id)) != keccak256(bytes (oldUser.propertyList[i]))) {
                oldUser.propertyList.push(oldUser.propertyList[i]);
            }
        }

        User storage newUser = addressToUserMapping[_newOwner];
        newUser.propertyList.push(_id);
    }

    function createBuyOrder(string memory _orderId, string memory _propertyId) 
    public registeredUsers(msg.sender) {

        Property memory property = idToPropertyMapping[_propertyId];

        BuyOrder memory newBuyOrder = BuyOrder({
            orderId: _orderId,
            propertyId: _propertyId,
            buyer: msg.sender,
            currentOwner: property.currentOwner,
            status: "REQUESTED"
        });

        orderIdToBuyOrderMapping[_orderId] = newBuyOrder;

        User storage user = addressToUserMapping[property.currentOwner];

        user.buyOrders.push(_orderId);
    }

    function approveBuyOrder(string memory _orderId) 
    public registeredUsers(msg.sender) {
        require(orderIdToBuyOrderMapping[_orderId].currentOwner == msg.sender);

        BuyOrder storage buyOrder = orderIdToBuyOrderMapping[_orderId];

        buyOrder.status = "APPROVED";

        Property storage property = idToPropertyMapping[buyOrder.propertyId];

        property.pastOwners.push(msg.sender);
        property.currentOwner = buyOrder.buyer;

        User storage oldUser = addressToUserMapping[msg.sender];

        delete oldUser.propertyList;

        for(uint i=0;i<oldUser.propertyList.length;i++) {
            if(keccak256(bytes (buyOrder.propertyId)) != keccak256(bytes (oldUser.propertyList[i]))) {
                oldUser.propertyList.push(oldUser.propertyList[i]);
            }
        }

        User storage newUser = addressToUserMapping[buyOrder.buyer];
        newUser.propertyList.push(buyOrder.propertyId);
    }

    function rejectBuyOrder(string memory _orderId) 
    public registeredUsers(msg.sender) {
        require(orderIdToBuyOrderMapping[_orderId].currentOwner == msg.sender);

        BuyOrder storage buyOrder = orderIdToBuyOrderMapping[_orderId];

        buyOrder.status = "REJECTED";
    }
}
