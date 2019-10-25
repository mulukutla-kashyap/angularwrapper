// Register our component
// Vue.component('counter', {
// 	props: ['initialCountValue'],
//   template: '<div id="counter-component">' +
//   						'<button v-on:click="decrement" type="button">-</button>' + 
//             	'<input type="number" v-model="countValue" v-on:input="countUpdated" />' +
//             	'<button v-on:click="increment" type="button">+</button>' +
//             '</div>',
//   data: function() {
//     return {
//     	countValue: this.initialCountValue
//     }
//   },
//   watch: {
//   	initialCountValue: function(update) {
//     	this.countValue = update;
//       this.countUpdated();
//     }
//   },
//   methods: {
//   	increment: function() {
//     	this.countValue+=1;
//       this.$emit('increment', this.countValue);
//     },
//     decrement: function() {
//     	this.countValue-=1;
//       this.$emit('decrement', this.countValue);
//     },
//     countUpdated: function() {
//     	this.$emit('countupdated', this.countValue);
//     }
//   }
// });
// import BootstrapVue from 'bootstrap-vue'
// import VuePeerJS from 'vue-peerjs';
// import Peer from 'peerjs';
// import VJstree from 'vue-jstree'
// import contextMenu from 'vue-context-menu'
// import Enums from './Enums'

// Vue.config.productionTip = false

// Vue.use(BootstrapVue)
// // Vue.use(VuePeerJS, new Peer('sender', { host: 'localhost', port: 9000, path: '/' }))


// Vue.use(VuePeerJS, new Peer('gdb-receiver', { host: 'cie-erna-winwebstga02.prod.factset.com', port: 9955, path: '/' }))

// import BootstrapVue from './node_modules/bootstrap-vue'

Vue.component('gdbtree', {
	// props: [DataTree],
  // component: {
  //   VJstree: './node_modules/vue-jstree/dist/vue-jstree.js',
  //   contextMenu : './node_modules/vue-context-menu/vue-context-menu.js',
  //   BootstrapVue : './node_modules/bootstrap-vue/dist/bootstrap-vue.min.js',
    
  // },
  template: `
  <div class="GDBTree">

    <center><h1> GDB Tree Ahead of TypeAhead Filtering</h1></center>

        <!-- A text inbox which filters the given text -->
    <b-container fluid>
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Search from the list :</label>
        </b-col>
        <b-col sm="10" >
          <b-form-input id="input-default" placeholder="Enter the text to search ... " v-model="search" @keyup="inputKeyUp"></b-form-input>
        </b-col>
      </b-row>
    </b-container>
    
    <!-- Context Menu for Labels -->
    <context-menu id="context-menu" ref="ctxMenu" >
      <li @click="itemEvents.menuresult = 1">Add New Label</li>
      <li @click="itemEvents.menuresult = 2">Edit Label</li>
    </context-menu>

    <!-- Context MEnu for tables -->
    <context-menu id="context-menu-for-table" ref="ctxMenuTable">
      <li @click="itemEvents.menuresult = 1">Add New Table</li>
      <li @click="itemEvents.menuresult = 2">Edit Table</li>
    </context-menu>

    <!-- GDB Tree for displaying Tables and its corresponding labels -->
    <VJstree ref = "tree" :data="treeData" 
      :item-events="itemEvents"
      @item-drop = "validateRightPlaceToDrop" 
      draggable allow-batch whole-row>
          <template slot-scope="_" style="display: inherit;"> 
              <div style="display: inherit;" v-if="_.model.type=='label'" @contextmenu.prevent="$refs.ctxMenu.open">
                <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                {{_.model.text}}
              </div>
              <div style="display: inherit;" v-if="_.model.type=='table'" @contextmenu.prevent="$refs.ctxMenuTable.open">
                <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                {{_.model.text}}
              </div>
              <div style="display: inherit;" v-if="_.model.type=='list'">
                <i :class="_.vm.themeIconClasses" role="presentation" v-if="!_.model.loading"></i>
                {{_.model.text}}
              </div>
          </template>
    </VJstree>

  </div>        
  `,
  data : function(){
    return {
      requiredLabel : '', // This variable stores the data which comes through Peerjs communication

      itemEvents: {       //It is invoked whenever we right click on a label alog with Context Menu box 

        menuresult : 0,   // This variable stores the result of the menu

        contextmenu: function () {
                arguments[2].preventDefault();
                setTimeout(function(arg){
                      if (arg[0]["itemEvents"]["menuresult"] == 1)
                      {
                        if (arg[1].type == "table")
                        {
                            var newChild = prompt("Enter the table name :")
                            if (newChild)
                            {
                              arg[1].addAfter({"text": newChild, "opened": true, "type": "table"}, arg[0])
                            }
                        }
                        else if (arg[1].type == "label")
                        {
                          newChild = prompt("Enter the label name :")
                          if (newChild)
                          {
                            let newNode = {"text": newChild, "opened": true, "type": "label"}
                            arg[1].addAfter(newNode,arg[0])
                          }
                        }
                      }
                      else if (arg[0]["itemEvents"]["menuresult"] == 2)
                      {
                        if (arg[1].type == "table")
                        {
                            newChild = prompt("Enter the table name that you want to be displayed :")
                            if (newChild)
                            {
                              arg[1].text = newChild
                            }
                        }
                        else if (arg[1].type == "label")
                        {
                          newChild = prompt("Enter the label name you want to be displayed :")
                          if (newChild)
                          {
                            arg[1].text = newChild
                          }
                        }
                      }
                      arg[0]["itemEvents"]["menuresult"] = 0
                            
                  }, 1000, arguments)
              }
            },  
      search : '', //This stores the text box data for filtering

      // treeData : this.DataTree
      treeData: [ // Static data for displaying Tree 
        {
          "text": "List of tables",
          "type": "list", 
          "opened": true, 
          "dragDisabled" : true,
          "children": [
            {
              "text": "Table 1",
              "opened": true,
              "type" : "table",
              "dragDisabled" : true,
              "children": [
                {
                    "text": "label 1",
                    "opened": true,
                    "type": "label"
                },
                {
                    "text": "label 2",
                    "opened": true,
                    "type": "label"
                },
                {
                    "text": "label 3",
                    "opened": true,
                    "type": "label"
                }
              ] 
            },
            {
              "text": "Table 2",
              "opened": true,
              "type" : "table",
              "dragDisabled" : true,
              "children": [
                {
                    "text": "label 1",
                    "opened": true,
                    "type": "label"
                },
                {
                    "text": "label 2",
                    "opened": true,
                    "type": "label"
                },
                {
                    "text": "label 3",
                    "opened": true,
                    "type": "label"
                }
              ] 
            }
          ]
        }
      ]
    } 
  },
  methods: {
        validateRightPlaceToDrop: function(node, item, draggedItem, e)//Checks if the Drop is at the right place
        {
          if (item.type == "label" && draggedItem.type == "label")
          {
            item.addAfter(draggedItem, node)
            item.children = []
          }
        },
        inputKeyUp: function () { // Function for filtering the text box content
            var text = this.search
            const patt = new RegExp(text.toUpperCase());
            this.$refs.tree.handleRecursionNodeChilds(this.$refs.tree, function (node) {
                if (text !== '' && node.model !== undefined) {
                    const str = node.model.text.toUpperCase()
                    if (patt.test(str)) {
                        node.$el.querySelector('.tree-anchor').style.color = Enums.Colors.highlight
                        node.$el.hidden = false
                      } else {
                        node.$el.querySelector('.tree-anchor').style.color = Enums.Colors.general
                        if (node.model.type == "label")
                        {
                          node.$el.hidden = true
                        }
                    } 
                } else {
                    node.$el.querySelector('.tree-anchor').style.color = Enums.Colors.general
                    node.$el.hidden = false
                }
            })
        }   
  },
  mounted : function(){ 
    // this.$peer.on('connection', (conn) => { // Connection to another application for data transfer
    //   conn.on('data', (data) => {
    //     this.requiredLabel = data
    //   })
    // })
  },
  watch:{
    requiredLabel : function(val) // With this we are adding the label received through peerjs communication
    {
      if (this.requiredLabel != '')
      {
        this.$refs.tree.handleRecursionNodeChilds(this.$refs.tree, function (node) {
                if (node.data.selected == true){
                  if (node.data.type == "label")
                  {
                    node.data.addAfter({"text" : val, "type": "label", "opened": true}, node)
                  }
                  else if (node.data.type == "table")
                  {
                    node.data.addChild({"text" : val, "type": "label", "opened": true})
                  }
                }
            })
        this.requiredLabel = ''
      }
    }
  }
});




// Create anglar module + directive wrapper
// angular.module('app', [])
// 	.directive('counterWrapper', function($timeout) {
//   	return {
//     	restrict: 'A',
//       link: function(scope, elem) {
//       	// Set starting simple-counter value
//         scope.countValue = 0;
        
//         // Our Vue root instance
//       	scope.vue = new Vue({
//         	el: elem[0].querySelector('[ng-non-bindable]'),
//           data: {
//             initialCountValue: scope.countValue
//           },
//           methods: {
//           	updateCountValue: function(countValue) {
//             	scope.$apply(function() {
//               	scope.countValue = countValue;
//               });
//             }
//           }
//         });
        
//         // Send updates from angular to vue component
//         scope.incrementCount = function() {
//         	scope.vue.initialCountValue = scope.countValue + 10;
//         }
        
//         scope.decrementCount = function() {
//         	scope.vue.initialCountValue = scope.countValue - 10;
//         }
//       }
//     }
//   });


angular.module('app', [])
	.directive('treeWrapper', function($timeout) {
  	return {
    	restrict: 'A',
      link: function(scope, elem) {
      	// Set starting simple-counter value
        scope.DataTree = [ // Static data for displaying Tree 
          {
            "text": "List of tables",
            "type": "list", 
            "opened": true, 
            "dragDisabled" : true,
            "children": [
              {
                "text": "Table 1",
                "opened": true,
                "type" : "table",
                "dragDisabled" : true,
                "children": [
                  {
                      "text": "label 1",
                      "opened": true,
                      "type": "label"
                  },
                  {
                      "text": "label 2",
                      "opened": true,
                      "type": "label"
                  },
                  {
                      "text": "label 3",
                      "opened": true,
                      "type": "label"
                  }
                ] 
              },
              {
                "text": "Table 2",
                "opened": true,
                "type" : "table",
                "dragDisabled" : true,
                "children": [
                  {
                      "text": "label 1",
                      "opened": true,
                      "type": "label"
                  },
                  {
                      "text": "label 2",
                      "opened": true,
                      "type": "label"
                  },
                  {
                      "text": "label 3",
                      "opened": true,
                      "type": "label"
                  }
                ] 
              }
            ]
          }
        ];
        
        // Our Vue root instance
      	scope.vue = new Vue({
        	el: elem[0].querySelector('[ng-non-bindable]'),
          data: {
            DataTree: scope.DataTree
          },
          methods: {
          	updateCountValue: function(DataTree) {
            	scope.$apply(function() {
              	scope.DataTree = DataTree;
              });
            }
          }
        });
        
        // Send updates from angular to vue component
        scope.incrementCount = function() {
        	scope.vue.initialCountValue = scope.countValue + 10;
        }
        
        scope.decrementCount = function() {
        	scope.vue.initialCountValue = scope.countValue - 10;
        }
      }
    }
  });

// Bootstrap application
angular.bootstrap(document.body, ['app']);
