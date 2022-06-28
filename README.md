# Depreacted
Este projeto foi movido para o repositório Zeev Form, favor utilizar o pacote [Zeev Form](https://github.com/pedbernardo/zeev-form)

<br>
<br>

## 🖱️ Orquestra Form
Função utilitária para tratar eventos em campos de formulário utilizando **objeto** de configuração. Oculte e mostre campos de formulário, execute funções, vincule condições e _task aliases_ através de um simples objeto.

Ocultar e exibir campos em processos no Orquestra BPMS é uma tarefa muito recorrente, o Orquestra Form tenta desburocratizar essa função com um simples objeto de configuração.

Para usos mais específicos, faça uso de callbacks e tenha acesso simples aos valores atuais do campo de formulário.

_O Orquestra Form faz uso das funções utilitárias de show e hide do [Orquestra Utils](https://github.com/pedbernardo/orquestra-utils)_

<br>

## Instalação
Utilizando package managers

```bash
npm install orquestra-form

# ou com yarn

yarn add orquestra-form
```

Utilizando CDN
```html
<script src="https://cdn.jsdelivr.net/gh/pedbernardo/orquestra-form@0.2.0/dist/orquestra-form.js"></script>

<!-- ou minificado -->

<script src="https://cdn.jsdelivr.net/gh/pedbernardo/orquestra-form@0.2.0/dist/orquestra-form.min.js"></script>
```


## Como Utilizar

```js
import { useField, useFields } from 'orquestra-form'

const meuCampo = useFields({
  field: 'idDoCampo',
  triggers: ['change', 'keyup'],
  triggerOnly: true,
  alias: ['t01', 't02'],
  callback: value => console.log(`executo no trigger, valores do campo: ${value}`),
  when: {
    Sim: {
      show: ['idDoCampo2', 'idDoCampo3'],
      callback: value => console.log(`executo em condições verdadeiras, valores do campo: ${value}`),
      container: 'tr'
    }
  }
})

meuCampo.effect() // força a verificação when mesmo sem um trigger
meuCampo.value() // obtém os valores atuais do campo

// configurar múltiplos campos com um array
const { umCampo, outroCampo } = useFields([{
  field: 'idDoCampo',
  when: {
    Sim: {
      show: ['idDoCampo2', 'idDoCampo3']
    }
  }
}, {
  field: 'idOutroCampo',
  when: {
    Sim: {
      show: ['idDoCampo4']
    }
  }
}])
```

## Configuração

**Parâmetros e Configuração Padrão**
| Parâmetro   | Tipo     | Default    | Descrição |
|-------------|----------|------------|-----------|
| field       | string   |            |identificador do campo de formulário (xname no DOM, CodField no banco)
| triggers    | string[] | ['change'] | eventos do DOM que disparam callback e condições when
| runOnload   | boolean  | true       | se as condições e callback serão executadas ao carregar a página
| container   | string   | 'tr'       | qual o contâiner do campo a ser ocultado
| hiddenClass | string   | 'hidden'   | classe utilitária para ocultar o campo
| alias       | string[] |            | quando informado, condições e callback somente serão executados quando a tarefa atual conter um dos apelidos listados
| callback    | function |            | função executada sempre que algum dos eventos for disparado
| when        | object   |            | configuração das condições
| when.[condição] | object |  | configuração executada quando a condição for verdadeira
| when.[condição].show | string[] | | identificadores dos campos de formulário a serem exbidos
| when.[condição].container | string | 'tr' | qual o container do campo a ser ocultado dessa condição
| when.[condição].callback | function | | função executada quando a condição for verdadeira
| when.[condição].showGroup | string[] | | queryStrings dos containers nos quais serão exibidos os campos de formulário, inclusive o próprio container

<br>

### Maiores Detalhes

#### `when`
As condições são avaliadas pelas propriedades do objeto `when`, sendo seus efeitos (`callback`, `show`, `showGroup`) executados quando o valor do campo for igual a propriedade `when`.
**Importante** entender que os campos listados nas propriedades `show` ou `showGroup` serão **ocultados** quando o valor do campo for diferente da propriedade `when`.

#### `showGroup`
Essa propriedade é utilizada para exibir/ocultar múltiplos campos de formulário do Orquestra (encontrados através da presença da propriedade `xname`). Quando utilizado fará com que todos os campos encontrados sejam ocultados e exibidos e ainda o próprio container.

**Exemplo**
```js
{
  id: 'campo',
  when: {
    Sim: {
      showGroup: ['#id-da-tabela', '.classeContainer']
    }
  }
}
```

#### `callback`
> Params: values (string, string[]) , event (optional)

Permite maior flexibilidade para reagir aos eventos, viabilizando não se limitar a apenas a mostrar e exibir campos.

<br>

## Métodos

### `effect`
Força uma nova verificação `when` e a execução do callback (se houver) mesmo sem um dos triggers ser disparado.

**Exemplo de uso**
```js
const field = useField({
  field: 'idDoCampo',
  when: {
    Sim: {
      show: ['idDoCampo2', 'idDoCampo3']
    }
  }
})

field.effect()
```

<br>

### `value`
Retorna os valores atuais do campo de formulário, tratando campos checkbox como um array com todas as opções marcadas.

**Exemplo de uso**
```js
const field = useField({
  field: 'idDoCampo',
  when: {
    Sim: {
      show: ['idDoCampo2', 'idDoCampo3']
    }
  }
})

const currentValue = field.value()
```
