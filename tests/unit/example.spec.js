import { shallowMount, createLocalVue } from "@vue/test-utils";
import App from "../../src/App.vue";
import Vld from "../../src/v-vld";

// create an extended `Vue` constructor
const localVue = createLocalVue();
localVue.use(Vld);
const wrapper = shallowMount(App, {
  localVue,
});
describe("v-vld", () => {
  it("errList inject", () => {
    expect(wrapper.vm.errList).toEqual({});
  });
  it("error show", async () => {
    const input = wrapper.find('input[name="test"]');
    input.setValue("111122");
    await input.trigger("blur");
    input.setValue("");
    await input.trigger("blur");
    const errorBox = wrapper.find("#show-error");
    expect(errorBox.html()).toBe("<div><p>Foo</p></div>");
  });
});
