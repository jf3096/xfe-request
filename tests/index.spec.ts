// import ResponseModal from '../src/models/ResponseModal';
//
// const expect = chai.expect;
//
// declare let XFERequest: any;
// describe('XFERequest', () => {
//     it('jQueryRequest: 模拟登陆成功，正确解析返回数据', () => {
//         const url = 'http://localhost:3000/login-success';
//         return XFERequest.jQueryRequest.get(url).then((response: ResponseModal) => {
//             const {code, data, message} = response;
//             expect(code).to.be.equal(1);
//             expect(data).to.be.eql({
//                 request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE41'
//             });
//             expect(message).to.be.equal('');
//         });
//     });
//     // it('jQueryRequest: 模拟登陆失败，正确解析返回数据', () => {
//     //     const url = 'http://localhost:3000/login-error';
//     //     return XFERequest.jQueryRequest.get(url).then((response: ResponseModal) => {
//     //         const {code, data, message} = response;
//     //         expect(code).to.be.equal(1);
//     //         expect(data).to.be.eql({
//     //             request_id: '2A5BDF18-F11F-9CEB-CE93-348AB9340EE41'
//     //         });
//     //         expect(message).to.be.equal('');
//     //     });
//     // });
// });
