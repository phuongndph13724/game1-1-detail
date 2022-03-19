import {
  _decorator,
  Component,
  Node,
  Prefab,
  CCInteger,
  instantiate,
  Vec3,
  Label,
} from "cc";
import { PlayerController } from "./PlayerController";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameManager
 * DateTime = Wed Mar 16 2022 09:28:43 GMT+0700 (Indochina Time)
 * Author = dacphuongotp
 * FileBasename = GameManager.ts
 * FileBasenameNoExtension = GameManager
 * URL = db://assets/Scripts/GameManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
enum BlockType {
  /**
   * B11-1
   * Khai báo một object có 2 thuộc tính
   * BT_NONE = 0
   * BT_STONE = 1
   */
  BT_NONE,
  BT_STONE,
}
enum GameState {
  /**
   * B16
   * Thêm logic trạng thái trò chơi, nói chung nó có thể được chia thành ba trạng thái:
   * Init : hiển thị menu trò chơi và khởi tạo một số tài nguyên.
   * Chơi : ẩn menu trò chơi, người chơi có thể vận hành trò chơi.
   * Kết thúc : kết thúc trò chơi và hiển thị menu kết thúc.
   *
   */
  GS_INIT,
  GS_PLAYING,
  GS_END,
}

@ccclass("GameManager")
export class GameManager extends Component {
  /**
   * B11-2: Khởi tạo thuộc tính cubePrfb cho Prefab cube có giá trị null
   * Khởi tạo thuộc tính roadLength (độ dài của đường nhảy có giá trị là 100)
   * khai báo thuộc tính _road có kiểu dữ liệu là mội mảng Number[] có giá trị bằng rỗng
   */
  @property({ type: Prefab })
  public cubePrfb: Prefab | null = null;
  @property({ type: CCInteger })
  public roadLength: Number = 1000;

  @property({ type: Label })
  public stepsLabel: Label | null = null;
  // B26-1 Khởi tạo Component stepsLabel cho GameManager

  @property({ type: PlayerController })
  public playerCtrl: PlayerController = null;
  //   B19: Khởi tạo PlayerController cho GameManager

  @property({ type: Node })
  public startMenu: Node = null;
  /**
   * B20
   * Để tự động mở / đóng menu đang mở, StartMenu cần phải tham chiếu đến GameManager.
   *  Kéo StartMenu khung cảnh vào biến này trong bảng StartMenu
   *  Kéo Player khung cảnh vào biến này trong bảng PlayCtrl
   * Sửa đổi mã trong phương thức start (),init(), set curState()
   */

  private _road: number[] = [];
  //   khai báo thuộc tính đường nhảy
  private _curState: GameState = GameState.GS_INIT;
  // khai báo thuộc tính đại diện cho trạng thái game
  // [1]
  // dummy = '';

  // [2]
  // @property
  // serializableDummy = 0;

  start() {
    // this.generteRoad();
    // //B14 gọi dến hàm generteRoad() để chạy
    // Kéo Cube trong Prefabs vào (GameManager)  CubePrfb trong nút GameManager
    // Kéo Camenra main xuống Player
    // Tạo một Button tên là PlayerButton trong nút csene
    // Tạo một nút có tên là StartMenu trong Canvas và kéo PlayButton vào trong
    // Điều chỉnh kích thước cho phù hợp
    // Tạo một nút Sprite có tên là BG trong StartMenu và kéo lên trước PlayerButton

    // B22-1 : Trỏ đến hành động curState có giá trị bằng GameState.GS_INIT để bắt đầu game
    this.curState = GameState.GS_INIT;

    this.playerCtrl?.node.on("JumpEnd", this.onPlayerJumpEnd, this);
    // B25-1 Thêm sự kiện kết thúc trò chơi cho game bằng hàm onPlayerJumpEnd
  }

  /**
   * B21
   * Khởi tạo phương thức init() bắt đầu cho player
   * 
   
   */
  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
      // nếu có startMenu thì bắt đầu sẽ bằng sự kiện click chuột
    }
    this.generteRoad();
    if (this.playerCtrl) {
      // nếu có playerCtrl thì không bắt đầu game và cho player đứng im
      this.playerCtrl.setInputActive(false);
      this.playerCtrl.node.setPosition(Vec3.ZERO);
    }
    this.playerCtrl.reset();
    // B25-4 : gọi đến phương thức reset game
  }
  /**
   * B26: Tạo một label mới có tên Steps trong Canvas có type string là 0
   * B26-2 Kéó Steps vào StepLabel trong GameManager và sửa đổi trong set curState()
   */

  /**
   * B22
   * Khởi tạo hành động curState có giá trị là GameState
   *
   */
  set curState(value: GameState) {
    switch (value) {
      // tạo vòng lặp game
      case GameState.GS_INIT:
        this.init();
        break;
      // nếu value là GameState.GS_INIT thì trỏ đến phương thức init() để start trò chơi

      case GameState.GS_PLAYING:
        if (this.startMenu) {
          this.startMenu.active = false;
          // nếu có startMenu ở GameManager (scene)  thì
          // trỏ đến setInputActive(active: boolean) ở PlayController chuyển thành giá trị là False
        }

        if (this.stepsLabel) {
          // B26-3 Đặt lại số bước đã nhảy được bằng 0
          this.stepsLabel.string = "0";
        }

        setTimeout(() => {
          if (this.playerCtrl) {
            this.playerCtrl.setInputActive(true);
            // nếu có playerCtrl thì trỏ đến setInputActive(active: boolean) ở PlayController
            // để thực hiện hành động start click chuột để bắt đầu game
          }
        }, 0.1);
        break;
      case GameState.GS_END:
        break;
    }
    this._curState = value;
    // trỏ đến trạng thái _curState có giá trị là các case trong switch(case);
  }

  /**
   * B23: Khởi tạo phương thức click vào button thì sẽ bắt đầu game
   * Gán GameManager cho PlayButton trong scene - GameManager - onStartButtonClickde()
   */
  onStartButtonClicked() {
    this.curState = GameState.GS_PLAYING;
  }

  generteRoad() {
    /**
     * B13 Khởi tạo phương thức : tạo các đoạn đường nhảy cho player
     */
    this.node.removeAllChildren();
    this._road = [];
    // trỏ đến thuộc tính đường nhảy
    // startPos bắt đầu position
    this._road.push(BlockType.BT_STONE);

    for (let i = 1; i < this.roadLength; i++) {
      // i là các vị trí của khối đường nhảy
      if (this._road[i - 1] === BlockType.BT_NONE) {
        //   nếu i đường nhảy - 1 = 0 thì =>đoạn đường nhảy sẽ bằng 1
        this._road.push(BlockType.BT_STONE);
      } else {
        this._road.push(Math.floor(Math.random() * 2));
        // khởi tạo các đoạn đường có khoảng cách tối đa bằng 1
      }
    }

    for (let j = 0; j < this._road.length; j++) {
      let block: Node = this.spawnBlockByType(this._road[j]);
      if (block) {
        //   nếu có block thì
        this.node.addChild(block);
        block.setPosition(j, -1.5, 0);
        // console.log(j);
      }
    }
  }

  spawnBlockByType(type: BlockType) {
    /**
     * B12  khởi taih biến block được trỏ tới phương thức spawnBlockByType có giá trị truyền vào là một _road[j]
     *
     * B15 Tạo một menu bắt đầu đơn giản bắt đầu
     * Tạo một nút button có chế độ xem là 2D trong scene
     * Thêm khung nền bằng cách tạo một Sprite nút có tên BG bên dưới StartMenu
     * Tạo một nút
     *
     */
    if (!this.cubePrfb) {
      return null;
    }
    let block: Node | null = null;
    switch (type) {
      case BlockType.BT_STONE:
        block = instantiate(this.cubePrfb);
        break;
      //     console.log("hàm spawnBlockByType có giá trị block");
      //   console.log(block);
    }
    return block;
  }

  /**
   * B25
   * Tăng logic thất bại và kết thúc để đánh giá cách trò chơi đang được chơi.
   * Nếu Player nhảy đến một ô trống hoặc vượt quá giá trị độ dài tối đa, trò chơi sẽ kết thúc
   */
  checkResoult(moveIndex: number) {
    if (moveIndex <= this.roadLength) {
      // nếu moveIndex mà nhỏ hơn hoặc bằng độ dài đoạn đường nhảy
      if (this._road[moveIndex] === BlockType.BT_NONE) {
        this.curState = GameState.GS_INIT;
        // nếu thuộc tính đường nhảy của moveIndex === 0 thì trạng thái game sẽ chuyển về lúc mới đầu
      }
    } else {
      // bỏ qua độ dài tối đa
      this.curState = GameState.GS_INIT;
      // ngược lại :  thuộc tính đường nhảy của moveIndex === 0 thì trạng thái game sẽ chuyển về lúc mới đầu
    }
  }

  onPlayerJumpEnd(moveIndex: number) {
    this.stepsLabel.string = "" + moveIndex;
    // B26-4 : Cộng thêm số điểm sau mỗi bước nhảy

    this.checkResoult(moveIndex);
    // B25-2 Khai báo phương thức kết thúc là trỏ đến phương thức checkResoult có giá trị là moveIndex
  }

  /**
   * B27 : Thêm bóng đổ cho nhân vật
   * Trong bảng Hệ thống phân cấp , hãy nhấp vào Scene nút ở trên cùng,
   *  kiểm tra Enabled thuộc shadows tính và sửa đổi các thông số Distance và Normal
   * Sửa ShadowColor thành màu đen và sửa Normal thành (0,0,1); distance thành -1
   * Nhấn vào nút phân cấp Body chuyển ShadowCastingMode thành ON
   * Lúc này chưa nhìn thấy bóng của player => Nhấn vào nut Main Light chuyển Rotation thành (-10,17,0)
   *
   */

  /**
   * B28 : Dowload Hình ảnh game cho phayer
   * Kéo folder cocos vào assets
   * Kéo Cocos trong cocos vào bên trong Body
   * Remove cc.MeshRenderer
   * Created Spot Light trong Body => B29 bên PlayerController
   *
   */

  // update (deltaTime: number) {
  //     // [4]
  // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
