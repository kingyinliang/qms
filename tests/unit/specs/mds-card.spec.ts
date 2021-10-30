import { shallowMount } from '@vue/test-utils'
import MdsCard from '@/components/package/mds-card/src/mds-card.vue'

describe('MdsCard.vue', () => {
  const title = 'title'
  const iconBg = 'rgb(0, 0, 0)'
  const wrapper = shallowMount(MdsCard, {
    props: { title, iconBg },
  })
  it('renders props.title when passed', () => {
    expect(wrapper.props().title).toMatch(title)
    expect(wrapper.text()).toContain(title)
  })
  it('renders props.iconBg when passed', () => {
    expect(wrapper.props().iconBg).toMatch(iconBg)
    expect(wrapper.find('.title-icon').attributes().style).toContain(iconBg)
  })
})
