import classNames from 'classnames';
import styles from './Button.module.scss';
import Icons from '../icons/Icons';

function Button({ className, ...props }) {
  const { text, icon, color, iconRight } = props;

  return (
    <div className={classNames(styles.wrapper, className, { [styles.iconRight]: iconRight })}>
      {icon && <Icons id={icon} fill={color} className={styles.icon} />}
      <p>{text}</p>
    </div>
  );
}

export default Button;
