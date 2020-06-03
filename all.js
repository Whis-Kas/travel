(function() {
    // Vue.component('button', {
    //     props: []
    //     templete:  
    // })

    let app = new Vue({
        el: '#app',
        data: {
            data: {},
            regions: [],
            region: '全部',
            viewPoint: [], //同個區域的所有資料
            pageTotal: [], //總共有幾頁
            viewPointPage: [], //縮小區域的資料
            nowPage:'',
            maxResult: 6, //一頁顯示幾筆
        },
        mounted() {
            const url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
    
            axios.get(url).then((res) => {
                this.data = res.data.result
                this.creatSelect()
                this.updateList()
            }).catch((err) => {
                alert(err)
            })
        },
        methods: {
            creatSelect() {
                this.data.records.forEach((item) => {
                    this.regions.push(item.Zone)
                })
                this.regions = this.regions.filter((item, index, arr) => arr.indexOf(item) === index)
                
            },
            updateList() {
                this.viewPoint = []
                this.data.records.forEach((item) => {
                    if(this.region == '全部'){
                        this.viewPoint.push(item)
                    }else if(item.Zone == this.region){
                        this.viewPoint.push(item)
                    }                
                })
                
                this.creatPagination()
                this.switchPage(1)//預設第一頁
            },
            creatPagination() {//產生分頁按鈕    
                this.pageTotal = []
                let pageNum = Math.ceil(this.viewPoint.length / this.maxResult)
                for(let i=1; i<=pageNum; i++){
                    this.pageTotal.push(i)
                }
            },
            switchPage(num) {
                this.nowPage = num
                if(this.nowPage<1){
                    this.nowPage = 1
                }
                if(this.nowPage > this.pageTotal.length){
                    this.nowPage = this.pageTotal.length
                }
                let maxRec = this.nowPage * this.maxResult - 1
                let minRec = (this.nowPage-1) * this.maxResult
                if(maxRec >= this.viewPoint.length){ //如果不加=，假如資料9筆就不會觸發-1
                    maxRec = this.viewPoint.length-1 //最大不超過資料數，索引值需-1
                }
                this.viewPointPage=[]
                
                for(let i=minRec; i<=maxRec; i++){
                    this.viewPointPage.push(this.viewPoint[i])
                }
                // console.log(this.region, '總共'+this.viewPoint.length, '這頁顯示'+ this.viewPointPage.length, maxRec, minRec)
            },
        },
    })
})()
