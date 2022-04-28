import React, { useState, useRef } from "react";
import {
  useAdaptivity,
  AppRoot,
  SplitLayout,
  SplitCol,
  ViewWidth,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  ModalRoot,
  ModalPage,
  Div,
  CellButton,
  FormItem,
  Button,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./App.css";

function App() {
  const { viewWidth } = useAdaptivity();
  const secondInputRef = useRef(null);
  const error = useRef(null);
  const success = useRef(null);
  const [activeModal, setActiveModal] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
  const token = "cd85752a0e38c525221c5e3d1ba0a736e8aeb0b2";

  /**
   * Создание фокуса для инпута, когда открывается второе модальное окно
   */
  const handleOpenOfModalPage = React.useCallback(() => {
    secondInputRef.current.focus();
  }, []);

  /**
   * 
   * Функция для обработки запроса
   */
  async function sendRequest(query) {
    let options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + token
      },
      body: JSON.stringify({ query: query })
    }

    try {
      let response = await fetch(url, options);
      return await response.json();
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Валидация поля ИНН
   */
  function validator() {

    if (!/^\d{10,12}$/gm.test(secondInputRef.current.value)) {
      error.current.innerHTML = "Введите корректный ИНН";
      success.current.innerHTML = "";
      setShowCompany(false);
      return;
    }

    success.current.innerHTML = "Идёт проверка ...";
    error.current.innerHTML = "";

    checkCompany();
  }

  /**
   * Функция для проверки объекта запроса
   */
  async function checkCompany() {
    let data = await sendRequest(secondInputRef.current.value)
    if (data.suggestions.length !== 0) {
      setCompanyName(data.suggestions.shift().value);
      setShowCompany(true);
      return;
    }
    setShowCompany(false);
  }

  /**
   * Структура модальных окон
   */
  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        id="modal-2"
        onClose={() => setActiveModal(null)}
      >
        <Div>
          <Div>
            <img src="https://picsum.photos/seed/picsum/200/300" alt="Здесь доллжна быть картинка" className="image" />
          </Div>
          <Div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ullamcorper nibh felis, ut lacinia dui euismod sit amet. Nam venenatis, mauris in accumsan auctor, arcu justo lobortis ligula, ut interdum mi massa eu nulla. Morbi bibendum, diam rhoncus semper sagittis, elit justo scelerisque eros, ut facilisis eros lectus eget lectus. Nulla iaculis leo non fringilla feugiat. Nullam bibendum faucibus convallis. Nulla cursus pharetra tortor, vitae pellentesque nisi semper ut. Sed non nisi nec ex tincidunt tristique at sit amet risus. In nec purus massa. Praesent convallis vitae ex a commodo. Suspendisse potenti. Nullam et iaculis metus. Proin auctor elementum lorem, ac eleifend dolor elementum non. Etiam sit amet suscipit risus. Cras efficitur dui nibh, at faucibus elit cursus eget.
          </Div>
          <Div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ullamcorper nibh felis, ut lacinia dui euismod sit amet. Nam venenatis, mauris in accumsan auctor, arcu justo lobortis ligula, ut interdum mi massa eu nulla. Morbi bibendum, diam rhoncus semper sagittis, elit justo scelerisque eros, ut facilisis eros lectus eget lectus. Nulla iaculis leo non fringilla feugiat. Nullam bibendum faucibus convallis. Nulla cursus pharetra tortor, vitae pellentesque nisi semper ut. Sed non nisi nec ex tincidunt tristique at sit amet risus. In nec purus massa. Praesent convallis vitae ex a commodo. Suspendisse potenti. Nullam et iaculis metus. Proin auctor elementum lorem, ac eleifend dolor elementum non. Etiam sit amet suscipit risus. Cras efficitur dui nibh, at faucibus elit cursus eget.
          </Div>
          <Div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ullamcorper nibh felis, ut lacinia dui euismod sit amet. Nam venenatis, mauris in accumsan auctor, arcu justo lobortis ligula, ut interdum mi massa eu nulla. Morbi bibendum, diam rhoncus semper sagittis, elit justo scelerisque eros, ut facilisis eros lectus eget lectus. Nulla iaculis leo non fringilla feugiat. Nullam bibendum faucibus convallis. Nulla cursus pharetra tortor, vitae pellentesque nisi semper ut. Sed non nisi nec ex tincidunt tristique at sit amet risus. In nec purus massa. Praesent convallis vitae ex a commodo. Suspendisse potenti. Nullam et iaculis metus. Proin auctor elementum lorem, ac eleifend dolor elementum non. Etiam sit amet suscipit risus. Cras efficitur dui nibh, at faucibus elit cursus eget.
          </Div>
          <Div>
            <Button onClick={() => setActiveModal("modal-1")} >
              Далее
            </Button>
          </Div>
        </Div>
      </ModalPage>

      <ModalPage
        onOpened={handleOpenOfModalPage}
        onClose={() => setActiveModal(null)}
        id="modal-1">
        <FormItem top="ИНН">
          <div className="alert" ref={error}></div>
          <div className="success" ref={success}></div>
          <input
            type="text"
            ref={secondInputRef}
            className="inputINN"
            onChange={validator} />
        </FormItem>
        {
          showCompany ?
            <Div>Компания: {companyName} ИНН: {secondInputRef.current.value && ""}</Div> :
            <Div>Компания с таким ИНН не найдена (Не действующая)</Div>
        }
      </ModalPage>
    </ModalRoot>
  );

  return (
    <AppRoot>
      <SplitLayout header={<PanelHeader separator={false} />}>
        <SplitCol spaced={viewWidth && viewWidth > ViewWidth.MOBILE}>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>Test Task</PanelHeader>
              <Group header={<Header mode="secondary">Items</Header>}>
                <SplitLayout modal={modal}>
                  <SplitCol>
                    <View activePanel="main">
                      <Panel id="main">
                        <CellButton multiline onClick={() => setActiveModal("modal-2")}>
                          Кликните сюда, чтобы открыть модальное окно
                        </CellButton>
                      </Panel>
                    </View>
                  </SplitCol>
                </SplitLayout>
              </Group>
            </Panel>
          </View>
        </SplitCol>
      </SplitLayout>
    </AppRoot>
  );
}


export default App;
