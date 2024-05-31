// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


interface IModule {
    function getAmountSwap(address _from, address _to, uint256 _amount) external view returns(uint256 receivedAmount);
    
    function swap(address _from, address _to, uint256 _amount, uint256 _expectedAmount) external returns(uint256 receivedAmount);
}
interface ERC20Ext is IERC20 {
    function cost() external view returns(uint256);
    function Buy(address _to) external payable;
    function name() external view returns (string memory);


    function deposit() external payable ;
    /**
     * @dev Returns the symbol of the token.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the decimals places of the token.
     */
    function decimals() external view returns (uint8);
}
// imports
import "./ERC20.sol";
import "./Ownable.sol";
// libraries
import "./SafeERC20.sol";

contract SwapRouter is Ownable {
    using SafeERC20 for IERC20;

    Module[] public moduleSwap;

    mapping(address => bool) public  banAddress;

    mapping(address => address[]) public favoriteToken;

    mapping(address => History[]) public userHistory; 

    address[] public bannedAddress;


    struct History {
        string name;
        uint256 time;
    }

    struct Module {
        IModule moduleSwap;
        string name;
    }

    struct IERC20Info {
        address ERC20;
        uint256 id;
        uint256 decimals;
        uint256 cost;
        string name; 
        string symbol;
    }

    struct sellTokenInfo {
        uint256 tokenId;
        address seller;
        uint256 amount;
    }

    struct RequestDex {
        address cont;
        string name;
    }

    RequestDex[] public requestDex;

    address[] public requestToken;

    IERC20Info[] public token;
    sellTokenInfo[] public sellInfo;

    modifier isBanned()  {
        require(!banAddress[msg.sender], 'You ban');
        _;
    }

    function getAllSwap(address _token1, address _token2, uint256 _amount) external isBanned view returns(uint256 maxReceivedAmount, uint256 moduleId) {  
        for(uint256 i = 0; i < moduleSwap.length; i++) {

            uint256 receivedAmount;

            if(address(moduleSwap[i].moduleSwap) == address(0)) {
                continue;
            }    

            receivedAmount = moduleSwap[i].moduleSwap.getAmountSwap(_token1, _token2, _amount);

            if(maxReceivedAmount < receivedAmount) {
                moduleId = i;
                maxReceivedAmount = receivedAmount;
            }
        }
    }

    function swap(address _token1, address _token2,  uint256 _amount, uint256 _expectedAmount,  uint256  _moduleId) external isBanned {
        require(address(moduleSwap[_moduleId].moduleSwap) != address(0), "swap: not found module");
        if (IERC20(_token1).allowance(address(this), address(moduleSwap[_moduleId].moduleSwap)) < _amount) {
            IERC20(_token1).safeIncreaseAllowance(address(moduleSwap[_moduleId].moduleSwap), type(uint256).max);
        }
        IERC20(_token1).safeTransferFrom(msg.sender, address(this), _amount);    
        
        uint256 receivedAmount = moduleSwap[_moduleId].moduleSwap.swap(_token1, _token2, _amount, _expectedAmount);   
        
        IERC20(_token2).safeTransfer(msg.sender, receivedAmount);
        userHistory[msg.sender].push(History(unicode"Обмен токена", block.timestamp));
    } 

    function SellToken(uint256 _amount, uint256 _tokenId) external isBanned  {
        ERC20Ext(token[_tokenId].ERC20).transferFrom(msg.sender, address(this), _amount);
        sellInfo.push(sellTokenInfo(_tokenId, msg.sender, _amount));
        userHistory[msg.sender].push(History(unicode"Продажа токена", block.timestamp));
    }

    function buyUserToken(uint256 _sellInfoId) external isBanned payable {
        require(msg.value >= sellInfo[_sellInfoId].amount*token[sellInfo[_sellInfoId].tokenId].cost/10**18, 'need More token');
        ERC20Ext(token[sellInfo[_sellInfoId].tokenId].ERC20).transfer(msg.sender, sellInfo[_sellInfoId].amount);
        delete sellInfo[_sellInfoId]; 
        userHistory[msg.sender].push(History(unicode"Покупка токена", block.timestamp));
    }

    function BuyToken(uint256 _amount, uint256 _tokenId)  external isBanned payable  {
        ERC20Ext(token[_tokenId].ERC20).Buy{value: _amount}(msg.sender);
        userHistory[msg.sender].push(History(unicode"Покупка токена", block.timestamp));
    }


    function addToken(address _token) public  onlyOwner {
        token.push(IERC20Info(_token, token.length, uint256(ERC20Ext(_token).decimals()), ERC20Ext(_token).cost(), ERC20Ext(_token).name(), ERC20Ext(_token).symbol()));
    }
    
    function deleteToken(uint256 _tokenId) external onlyOwner {
        delete token[_tokenId];
    }

    function addFavoriteToken(address _token) external isBanned { 
        favoriteToken[msg.sender].push(_token);
    }

    function addFavoriteToken(uint _tokenId) external isBanned { 
        delete favoriteToken[msg.sender][_tokenId];
    }

    function addModuleSwap(address module, string memory name) public onlyOwner {
        moduleSwap.push(Module(IModule(module), name));
    }

    function deleteModuleSwap(uint256 _moduleId) external onlyOwner {
        delete moduleSwap[_moduleId];
    }

    function BannedWallet(address _wallet) external onlyOwner {
        banAddress[_wallet] = true;
        bannedAddress.push(_wallet);
    }

    function UnbannedWallet(uint256 _walletId) external onlyOwner  {
        banAddress[bannedAddress[_walletId]] = false;
        delete bannedAddress[_walletId];
    }


    function AddRequestToken(address _token) external isBanned  {
        requestToken.push(_token);
    }

    function acceptRequestToken(uint256 _requestId, bool _solution) external onlyOwner {
        if(_solution) {
            addToken(requestToken[_requestId]);
        }
        delete requestToken[_requestId];
    }

    function addRequestDex(address _Dex, string memory _name) external isBanned {
        requestDex.push(RequestDex(_Dex, _name));
    }

    function acceptRequestDex(uint256 _requestId, bool _solution) external onlyOwner {
        if(_solution) {
            addModuleSwap(requestDex[_requestId].cont, requestDex[_requestId].name);
        }
        delete requestToken[_requestId];
    }
    function addHistory(string memory _text) external  {
        userHistory[msg.sender].push(History(_text, block.timestamp));
    }


    function getBannedWallet() external view onlyOwner returns(address[] memory) {
        return bannedAddress;
    }

    function getToken() external view isBanned  returns(IERC20Info[] memory) {
        return token;
    }

    function getSellInfo() external view isBanned  returns(sellTokenInfo[] memory) {
        return sellInfo;
    }

    function tranferToken(address _to, uint256 _amount, uint256 _tokenId) external isBanned {
        ERC20Ext(token[_tokenId].ERC20).transferFrom(msg.sender, _to, _amount);
    }


    function getRequestTokens() external isBanned view returns(address[] memory)  {
        return requestToken;
    }

    function getRequestDex() external isBanned view returns(RequestDex[] memory)  {
        return requestDex;
    }

    function getUserHistory() external isBanned view returns(History[] memory) {
        return userHistory[msg.sender];
    }

    function getBalanceOfContract() external isBanned view returns(uint256[] memory) {
        uint256[] memory tokensBalance = new uint256[](token.length);
        for(uint256 i = 0; i < token.length; i++) {
            tokensBalance[i] = (ERC20Ext(token[i].ERC20).balanceOf(msg.sender));
        }
        return tokensBalance;
    }


    function getBalanceOf(address _to, address[] memory _tokens) external isBanned view returns(uint256[] memory) {
        uint256[] memory tokensBalance = new uint256[](_tokens.length);
        for(uint256 i = 0; i < token.length; i++) {
            tokensBalance[i] = (ERC20Ext(_tokens[i]).balanceOf(_to));
        }
        return tokensBalance;
    }
}