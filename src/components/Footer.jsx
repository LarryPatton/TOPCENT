import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-compact">
        <div>
          <div className="footer-brand">TOPCENT</div>
          <p>
            现代工业五金产品信息平台，当前版本聚焦产品中心、分类导航和产品资料展示。
          </p>
        </div>

        <div>
          <h4>产品入口</h4>
          <div className="footer-links">
            <Link to="/products">产品中心</Link>
            <Link to="/search?q=BD.3000">型号搜索</Link>
          </div>
        </div>

        <div>
          <h4>数据状态</h4>
          <div className="footer-links footer-meta">
            <span>Excel 分类导入</span>
            <span>图片资源映射</span>
            <span>Product Center Only</span>
          </div>
        </div>

        <div>
          <h4>联系方式</h4>
          <div className="footer-links footer-meta">
            <span>+86 574 8627 0910</span>
            <span>info@topcent.com</span>
            <span>浙江省宁波市鄞州区姜山镇科技园区</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
