import FloatingBubble from './FloatingBubble';

/**
 * Tooltip — 마우스 올리면 뜨는 말풍선. FloatingBubble(Floating UI) 기반이라
 * overflow에 안 잘리고 화면 밖이면 자동으로 flip/shift 된다.
 *
 * @param {String} props.text      말풍선 텍스트 (기본 '텍스트를 넣어주세요.')
 * @param {String} props.position  'top-center'(기본) 등 12방향
 *   'top-start' | 'top-center' | 'top-end' | 'right-start' | 'right-center' | 'right-end'
 *   | 'bottom-start' | 'bottom-center' | 'bottom-end' | 'left-start' | 'left-center' | 'left-end'
 * @param {String} props.color     배경색 (기본 어두운 버블)
 * @param {String} props.textColor 글자색 (기본 흰색)
 */
function Tooltip({
  text = '텍스트를 넣어주세요.',
  position = 'top-center',
  color = 'var(--seed-invert-bg)',
  textColor = 'var(--seed-invert-text)',
  children,
}) {
  // 기존 '-center'(가운데)는 Floating UI의 기본(측면만)에 해당 → 바 side로 변환
  const placement = position.replace('-center', '');

  return (
    <FloatingBubble
      content={text}
      placement={placement}
      color={color}
      textColor={textColor}
      display="inline-block"
    >
      {children}
    </FloatingBubble>
  );
}

export default Tooltip;
