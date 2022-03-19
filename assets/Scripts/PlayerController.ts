import {
  _decorator,
  Component,
  Node,
  Animation,
  Vec3,
  input,
  Input,
  EventMouse,
  SkeletalAnimation,
} from "cc";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerController
 * DateTime = Mon Mar 14 2022 09:49:12 GMT+0700 (Indochina Time)
 * Author = dacphuongotp
 * FileBasename = PlayerController.ts
 * FileBasenameNoExtension = PlayerController
 * URL = db://assets/Scripts/PlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */

@ccclass("PlayerController")
export class PlayerController extends Component {
  // [1]
  // dummy = '';
  // B7
  // Thêm một folder Animations ở phần assets
  // Tạo clip oneStep.anim có vị trí lần lượt là  (0, 0, 0) , (0, 0,5, 0) , (0, 0, 0) .
  // Tạo clip twoStep.anim có vị trí lần lượt là  (0, 0, 0) , (0, 1, 0) , (0, 0, 0) .
  // Khởi tạo thành phần hoạt ảnh Animation
  // Sửa Clips trong cc.Animation thành 2
  @property({ type: Animation })
  public BodyAnim: Animation | null = null;
  // Kéo 2 clip vào Clips cho oneStep.anim thành clip default
  // Trong nút Player kéo Body đến BodyAnim
  // @property
  // serializableDummy = 0;

  @property({ type: SkeletalAnimation })
  public CocosAnim: SkeletalAnimation | null = null;
  /**
   * B29: Khởi tạo thành phần cho Hoạt ảnh Player
   * Kéo Cocos trong Body vào trong CocosAnim của Player
   * B29-1 : Sửa đổi trong phương thức jumpByStep()
   */

  /**
   * // B1:  Khởi tạo thuộc tính của đối tượng PlayerController
   * Đầu tiên ở vị trí (0, -1,5, 0) .
      Cái thứ hai ở vị trí (1, -1,5, 0) .
      Người thứ ba ở vị trí (2, -1,5, 0) .
  
   * Khởi tạo Node có tên là Player trong csene => Khởi tạo capsule cho Player có vị trí là (0,0,0)
      Để nhìn thấy đối tượng trong thời gian chạy, chúng ta cần điều chỉnh một số thông số của Máy ảnh trong cảnh, sửa position (0, 0, 13), sửa Rotation thành (0,0,0)
   */
  private _startJump: boolean = false;
  // khởi tạo thuộc tính đầu khi start game có giá trị là false;
  private _jumpStep: number = 0;
  //  khởi tạo thuộc tính bước nhảy cho player
  private _curJumpTime: number = 0;
  //  khởi tạo thời gian hiện tại của bước nhảy
  private _jumpTime: number = 0.4;
  // khởi tạo tốc độ bật nhảy của player
  private _curJumpSpeed: number = 0;
  // khởi tạo tốc độ thời gian của bước nhảy
  private _curPos: Vec3 = new Vec3();
  // khởi tạo vị trí hiện tại của Player là từ địa điểm của một Vec3 mới
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  // khởi tạo
  private _targetPos: Vec3 = new Vec3();
  // khởi tạo vị trí của player khi thực hiện bước nhảy là một Vec3 mới
  private _isMoving = false;
  // khởi tạo biến di chuyển cho player có giá trị là false

  private _curMoveIndex = 0;
  // B24-1: Khởi tạo điểm số đạt được khi chơi có giá trị khởi tạo ban đầu bằng 0

  start() {
    // [3]
    (window as any).player = this;
    // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this); (B17)
    //B4: khởi tạo hành động từ người dùng nhập vào ở phương thức onMouseUp
    // B17: bật tắt động tính năng theo dõi tin nhắn chuột của nhân vật.
  }
  reset() {
    this._curMoveIndex = 0;
    // B25-3 : Phương thức reset game khi trò chơi kết thúc => gọi phương thức này ra tại
    // phương thức init trong GameManager
  }
  /**
   * B18:
   */
  setInputActive(active: boolean) {
    if (active) {
      console.log(active);
      // Nếu active === true thì thêm sự kiện click chuột cho player
      input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    } else {
      input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
  }

  onMouseUp(event: EventMouse) {
    // B3:  khởi tạo phương thức onMouseUp có biến là event type EventMouse từ "cc"
    if (event.getButton() === 0) {
      this.jumpByStep(1);
      //   nếu lấy event giá trị trả về = 0 thì trỏ đến phương thức jumpByStep có giá trị là 1
    } else if (event.getButton() === 2) {
      this.jumpByStep(2);
      //   nếu lấy event giá trị trả về = 2 thì trỏ đến phương thức jumpByStep có giá trị là 2
    }
  }

  jumpByStep(step: number) {
    //B2:   Khởi tạo phương thức jumpByStep có biến là step type number
    if (this._isMoving) {
      return;
      // nếu có biến _isMoving thì không có giá trị trả về
    }
    this._startJump = true; // trỏ đến biến _startJump đổi thành giá trị true
    this._jumpStep = step; // trỏ đến biến _jumpStep đổi thành giá trị step
    this._curJumpTime = 0; // trỏ đến biến _curJumpTime
    this._curJumpSpeed = this._jumpStep / this._jumpTime;
    // biến đổi thành _jumpStep/_jumpTime
    this.node.getPosition(this._curPos); // trả về giá trị là một Vec3 mới
    Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));

    this._isMoving = true; // Chuyển đổi không di chuyển thành có di chuyển

    if (this.CocosAnim) {
      // B29-1 : Nếu có CocosAnim thì  Hoạt ảnh nhảy mất nhiều thời gian, đây là tốc độ phát lại
      // =>  onOnceJumpEnd()
      this.CocosAnim.getState("cocos_anim_jump").speed = 3.5;

      /*
        getState (tên: string): AnimationState;
         / **
          * @en
          * Tạo trạng thái cho clip được chỉ định.
          * Nếu đã có một clip có cùng tên, trạng thái hoạt ảnh hiện có sẽ bị dừng và bị ghi đè.
          * @en
          * Tạo trạng thái hoạt hình bằng clip hoạt hình được chỉ định.
          * Nếu trạng thái hoạt ảnh với tên được chỉ định đã tồn tại, trạng thái hoạt ảnh hiện có trước tiên sẽ được đặt thành dừng và ghi đè.
          * @param clip Clip hoạt hình
          * @param name Tên trạng thái hoạt ảnh, nếu không có, tên của clip mặc định sẽ được sử dụng
          * @returns Trạng thái hoạt ảnh được tạo
          * /
      */
      // Phát hoạt ảnh nhảy
      this.CocosAnim.play("cocos_anim_jump");
    }

    // B8: Thêm mã phát lại hoạt ảnh vào chức năng nhảy jumpByStep
    if (this.BodyAnim) {
      if (step === 1) {
        this.BodyAnim.play("oneStep");
      } else if (step === 2) {
        this.BodyAnim.play("twoStep");
      }
      // B9 Nâng cấp đường
      /**
       * Tạo một folder có tên là Pfabs
       * Kéo khối hình ảnh Cube đầu tiên xuống
       */
      /**
       * B10 Tạo một file .ts trong folder Scripts có tên là GameManager
       * => file GameManager.ts
       */
    }
    this._curMoveIndex += step;
    // B24-2 : trỏ đến _curMoveIndex có giá trị += bước nhảy
  }

  onOnceJumpEnd() {
    //B5 Khởi tạo phương thức kết thúc cho đối tượng
    this._isMoving = false; // trỏ thành k di chuyển

    // B29-2 : xong sửa đổi trạng thái chờ trong phương thức onOnceJumpEnd()
    if (this.CocosAnim) {
      this.CocosAnim.play("cocos_anim_idle");
    }

    this.node.emit("JumpEnd", this._curMoveIndex);
    // B24-3 : Gửi tin nhắn mỗi bước nhảy mỗi lần kết thúc trò chơi
  }

  update(deltaTime: number) {
    //B6 khởi tạo phương thức update player có biến là detaTime type là number
    if (this._startJump) {
      // nếu có biến _startJump =>
      this._curJumpTime += deltaTime; // trỏ đến biến _curJumpTime += deltaTime
      if (this._curJumpTime > this._jumpTime) {
        // end
        this.node.setPosition(this._targetPos);
        this._startJump = false;
        this.onOnceJumpEnd();
        // console.log(this._curJumpTime);
        // console.log(this._jumpTime);
      } else {
        // tween
        this.node.getPosition(this._curPos);
        this._deltaPos.x = this._curJumpSpeed * deltaTime;
        Vec3.add(this._curPos, this._curPos, this._deltaPos);
        this.node.setPosition(this._curPos);
      }
    }
  }
}
/**
 * B6-1 :Thêm một  Component PlayController mới vào trong nút Player
 */

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
