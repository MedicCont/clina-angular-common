````md
# 📦 clina-angular-common

O **clina-angular-common** é um **Git Submodule** que contém **código compartilhado** entre os projetos **clina-dashboard** e **clina-marketplace**.

📌 Repositório: https://github.com/MedicCont/clina-angular-common.git

---

## 📍 Onde está no projeto

| Projeto     | Caminho Local                        |
|------------|--------------------------------------|
| Dashboard  | `clina-dashboard/src/app/modules/common`   |
| Marketplace| `clina-marketplace/src/app/modules/common` |

---

## 🔄 Como atualizar o submodule

### ✅ Atualizar para a versão mais recente do branch `main`

```bash
# Dentro do projeto dashboard
cd clina-dashboard
git submodule update --remote src/app/modules/common

# Dentro do projeto marketplace
cd clina-marketplace
git submodule update --remote src/app/modules/common
````

### 🧩 Inicializar o submodule (se nunca foi baixado)

```bash
git submodule update --init --recursive
```

### 🔎 Ver o status do submodule

```bash
git submodule status
```

---

## 🛠️ Como fazer alterações no `clina-angular-common`

Se você precisa editar o código do common:

### 1) Navegue até o submodule

```bash
cd clina-dashboard/src/app/modules/common
# ou
cd clina-marketplace/src/app/modules/common
```

### 2) Faça suas alterações e commit no repositório do submodule

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

### 3) Volte ao projeto pai e atualize a referência do submodule

```bash
cd ../../../..  # volta para clina-dashboard/ ou clina-marketplace/
git add src/app/modules/common
git commit -m "Atualiza submodule common"
git push
```

---

## 📂 O que contém o Common Module

O módulo contém código reutilizável como:

* `components/` — Componentes compartilhados
* `services/` — Serviços Angular
* `dtos/` — Data Transfer Objects
* `enums/` — Enumerações
* `queries/` — Queries GraphQL
* `mutations/` — Mutations GraphQL
* `inputs/` — Input types
* `assets/` — Assets compartilhados

```
```
